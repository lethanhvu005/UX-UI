import { DatabaseSync } from 'node:sqlite';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { initializeDatabase, loadDatabaseState, readState, saveCommitment, writeState } from '../src/database/repository.js';
import { groups } from '../src/groups.js';

// Chạy cùng repository trên SQLite thật; không thay thế kiểm thử Expo Go trên máy thật.
const directory = await mkdtemp(join(tmpdir(), 'greenlife-db-'));
const file = join(directory, 'test.db');
let sqlite;
function open() {
  sqlite = new DatabaseSync(file);
  const adapter = {
    execAsync: async sql => sqlite.exec(sql),
    runAsync: async (sql, ...params) => sqlite.prepare(sql).run(...params),
    getFirstAsync: async (sql, ...params) => sqlite.prepare(sql).get(...params),
    getAllAsync: async (sql, ...params) => sqlite.prepare(sql).all(...params),
    withExclusiveTransactionAsync: async callback => {
      sqlite.exec('BEGIN EXCLUSIVE');
      try { await callback(adapter); sqlite.exec('COMMIT'); }
      catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    },
  };
  return adapter;
}
try {
  let db = open();
  await initializeDatabase(db);
  assert.deepEqual(await loadDatabaseState(db), { groups, saved: false });
  await saveCommitment(db);
  const first = await db.getFirstAsync('SELECT committed_at FROM commitments');
  await saveCommitment(db);
  assert.equal((await db.getFirstAsync('SELECT COUNT(*) AS count FROM commitments')).count, 1);
  assert.deepEqual(await db.getFirstAsync('SELECT committed_at FROM commitments'), first);
  await db.runAsync('UPDATE materials SET name = ? WHERE id = 1', "PET 'đã cập nhật'");
  sqlite.close();
  db = open();
  await initializeDatabase(db);
  const restored = await loadDatabaseState(db);
  assert.equal(restored.saved, true);
  assert.equal(restored.groups[0].items[0][0], "PET 'đã cập nhật'");
  assert.equal(restored.groups.length, 4);
  assert.equal(restored.groups.reduce((count, group) => count + group.items.length, 0), 18);
  await assert.rejects(db.runAsync('INSERT INTO category_notes (category_id, content, sort_order) VALUES (?, ?, ?)', 'missing', 'invalid', 0));
  // Trạng thái ứng dụng (điểm, yêu thích…) lưu và đọc lại được.
  assert.equal(await readState(db), null);
  await writeState(db, { points: 185, favorites: ['act1'] });
  await writeState(db, { points: 190, favorites: ['act1', 'act2'] });
  assert.deepEqual(await readState(db), { points: 190, favorites: ['act1', 'act2'] });
  // Nâng cấp từ v1: dữ liệu mẫu được làm mới, cam kết và trạng thái người dùng được giữ.
  await db.execAsync('PRAGMA user_version = 1');
  await initializeDatabase(db);
  assert.equal((await db.getFirstAsync('PRAGMA user_version')).user_version, 2);
  assert.deepEqual((await loadDatabaseState(db)).groups, groups);
  assert.equal((await loadDatabaseState(db)).saved, true);
  assert.equal((await readState(db)).points, 190);
  console.log('DATABASE_TEST_SUCCESS: seed, Unicode, persistence, idempotency, migration v1→v2, app state, foreign keys');
} finally {
  sqlite?.close();
  await rm(directory, { recursive: true, force: true });
}

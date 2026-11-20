import { groups as seedGroups } from '../groups.js';

const SCHEMA_VERSION = 2;

async function seedCategories(tx) {
  await tx.execAsync('DELETE FROM category_notes; DELETE FROM materials; DELETE FROM categories;');
  for (const [position, group] of seedGroups.entries()) {
    await tx.runAsync('INSERT INTO categories VALUES (?, ?, ?, ?, ?, ?, ?)', group.id, group.label, group.title, group.emoji, group.color, group.noteTitle, position);
    for (const [index, [name, duration, image, progress]] of group.items.entries()) {
      // Cột emoji (v1) được dùng lại để lưu khóa ảnh của vật liệu.
      await tx.runAsync('INSERT INTO materials (category_id, name, duration, emoji, progress, sort_order) VALUES (?, ?, ?, ?, ?, ?)', group.id, name, duration, image, progress, index);
    }
    for (const [index, note] of group.notes.entries()) {
      await tx.runAsync('INSERT INTO category_notes (category_id, content, sort_order) VALUES (?, ?, ?)', group.id, note, index);
    }
  }
}

// Migration theo PRAGMA user_version, không ghi đè dữ liệu người dùng (commitments, app_state).
export async function initializeDatabase(db) {
  await db.execAsync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  const { user_version: version } = await db.getFirstAsync('PRAGMA user_version');
  if (version >= SCHEMA_VERSION) return;
  await db.withExclusiveTransactionAsync(async tx => {
    if (version < 1) {
      await tx.execAsync(`
        CREATE TABLE categories (
          id TEXT PRIMARY KEY NOT NULL, label TEXT NOT NULL, title TEXT NOT NULL,
          emoji TEXT NOT NULL, color TEXT NOT NULL, note_title TEXT NOT NULL,
          sort_order INTEGER NOT NULL
        );
        CREATE TABLE materials (
          id INTEGER PRIMARY KEY, category_id TEXT NOT NULL REFERENCES categories(id),
          name TEXT NOT NULL, duration TEXT NOT NULL, emoji TEXT NOT NULL,
          progress INTEGER NOT NULL CHECK(progress BETWEEN 0 AND 100), sort_order INTEGER NOT NULL
        );
        CREATE TABLE category_notes (
          id INTEGER PRIMARY KEY, category_id TEXT NOT NULL REFERENCES categories(id),
          content TEXT NOT NULL, sort_order INTEGER NOT NULL
        );
        CREATE TABLE commitments (
          id TEXT PRIMARY KEY NOT NULL, committed_at TEXT NOT NULL
        );
      `);
    }
    if (version < 2) {
      // v2: dữ liệu theo thiết kế GreenSteps + bảng trạng thái ứng dụng.
      await tx.execAsync('CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);');
      await seedCategories(tx);
    }
    await tx.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
  });
}

export async function loadDatabaseState(db) {
  const categories = await db.getAllAsync('SELECT * FROM categories ORDER BY sort_order');
  const materials = await db.getAllAsync('SELECT * FROM materials ORDER BY sort_order');
  const notes = await db.getAllAsync('SELECT * FROM category_notes ORDER BY sort_order');
  const commitment = await db.getFirstAsync('SELECT committed_at FROM commitments WHERE id = ?', 'green-living');
  return {
    groups: categories.map(row => ({
      id: row.id, label: row.label, title: row.title, emoji: row.emoji,
      color: row.color, noteTitle: row.note_title,
      items: materials.filter(item => item.category_id === row.id).map(item => [item.name, item.duration, item.emoji, item.progress]),
      notes: notes.filter(note => note.category_id === row.id).map(note => note.content),
    })),
    saved: !!commitment,
  };
}

export async function saveCommitment(db) {
  // Bấm nhiều lần không tạo bản ghi trùng hoặc đổi thời điểm cam kết ban đầu.
  await db.runAsync('INSERT OR IGNORE INTO commitments (id, committed_at) VALUES (?, ?)', 'green-living', new Date().toISOString());
}

export async function readState(db) {
  const row = await db.getFirstAsync('SELECT value FROM app_state WHERE key = ?', 'user');
  return row ? JSON.parse(row.value) : null;
}

export async function writeState(db, state) {
  await db.runAsync('INSERT INTO app_state (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', 'user', JSON.stringify(state));
}

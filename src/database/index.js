import { openDatabaseAsync } from 'expo-sqlite';
import { initializeDatabase, loadDatabaseState, readState, saveCommitment, writeState } from './repository';

let connection;
function getDatabase() {
  if (!connection) {
    connection = (async () => {
      const db = await openDatabaseAsync('greenlife.db');
      try { await initializeDatabase(db); return db; }
      catch (error) { await db.closeAsync(); throw error; }
    })().catch(error => { connection = undefined; throw error; });
  }
  return connection;
}
export async function loadAppData() { return loadDatabaseState(await getDatabase()); }
export async function commitGreenLiving() { await saveCommitment(await getDatabase()); }
export async function loadAppState() { return readState(await getDatabase()); }
export async function saveAppState(state) { await writeState(await getDatabase(), state); }

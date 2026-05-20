import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, process.env.DATABASE_URL || './db/app.sqlite');

let db: Database.Database | null = null;

export function getDB(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function query<T>(sql: string, params?: any[]): T[] {
  const stmt = getDB().prepare(sql);
  return stmt.all(...(params || [])) as T[];
}

export function run(sql: string, params?: any[]): Database.RunResult {
  const stmt = getDB().prepare(sql);
  return stmt.run(...(params || []));
}

export function get<T>(sql: string, params?: any[]): T | undefined {
  const stmt = getDB().prepare(sql);
  return stmt.get(...(params || [])) as T | undefined;
}

export function closeDB(): void {
  if (db) {
    db.close();
    db = null;
  }
}

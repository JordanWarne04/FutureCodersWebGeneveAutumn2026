import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { env } from '$env/dynamic/private';
const dir = env.DATA_DIR || '/data'; mkdirSync(dir,{recursive:true});
export const db = new Database(`${dir}/gallery.sqlite`);
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL DEFAULT '', title TEXT NOT NULL, description TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, approved INTEGER NOT NULL DEFAULT 1); CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL); INSERT OR IGNORE INTO settings VALUES ('submissions_enabled','true'); INSERT OR IGNORE INTO settings VALUES ('approval_required','true');`);
export const setting = key => db.prepare('SELECT value FROM settings WHERE key=?').get(key)?.value === 'true';
export const setSetting = (key,value) => db.prepare('UPDATE settings SET value=? WHERE key=?').run(value?'true':'false',key);

import Database from "better-sqlite3";
import path from "path";
import { mkdir, existsSync } from "fs";
import { promisify } from "util";

const mkdirAsync = promisify(mkdir);

// Ensure the database directory exists
const dbDir = path.join(process.cwd(), "data");
if (!existsSync(dbDir)) {
  mkdirAsync(dbDir, { recursive: true });
}

// Initialize the database
const db = new Database(path.join(dbDir, "chat.db"));

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS chats (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    chat_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
  );
`);

// Export the database instance
export { db };

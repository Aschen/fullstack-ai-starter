import { Message } from "ai";
import { generateId } from "ai";
import { db } from "./schema";

// Define types for database rows
interface ChatRow {
  id: string;
  created_at: number;
}

interface MessageRow {
  id: string;
  chat_id: string;
  role: string;
  content: string;
  created_at: number;
}

// Prepare statements for better performance
const insertChatStmt = db.prepare(`
  INSERT INTO chats (id, created_at) VALUES (?, ?)
`);

const insertMessageStmt = db.prepare(`
  INSERT INTO messages (id, chat_id, role, content, created_at)
  VALUES (?, ?, ?, ?, ?)
`);

const getChatStmt = db.prepare(`
  SELECT * FROM chats WHERE id = ?
`);

const getMessagesStmt = db.prepare(`
  SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC
`);

const deleteChatStmt = db.prepare(`
  DELETE FROM chats WHERE id = ?
`);

// Function to create a new chat
export async function createChat(): Promise<string> {
  const id = generateId();
  const now = Date.now();

  insertChatStmt.run(id, now);

  return id;
}

// Function to load a chat and its messages
export async function loadChat(id: string): Promise<Message[]> {
  const chat = getChatStmt.get(id) as ChatRow | undefined;

  if (!chat) {
    throw new Error(`Chat with ID ${id} not found`);
  }

  const messages = getMessagesStmt.all(id) as MessageRow[];

  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
    createdAt: new Date(msg.created_at),
  }));
}

// Function to save a chat with its messages
export async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  // Start a transaction
  const transaction = db.transaction(() => {
    // Check if chat exists, if not create it
    const chat = getChatStmt.get(id) as ChatRow | undefined;
    if (!chat) {
      insertChatStmt.run(id, Date.now());
    }

    // Delete existing messages for this chat
    db.prepare(`DELETE FROM messages WHERE chat_id = ?`).run(id);

    // Insert all messages
    for (const message of messages) {
      insertMessageStmt.run(
        message.id,
        id,
        message.role,
        message.content,
        message.createdAt ? new Date(message.createdAt).getTime() : Date.now()
      );
    }
  });

  // Execute the transaction
  transaction();
}

// Function to delete a chat
export async function deleteChat(id: string): Promise<void> {
  deleteChatStmt.run(id);
}

// Function to list all chats
export async function listChats(): Promise<{ id: string; createdAt: Date }[]> {
  const chats = db
    .prepare(`SELECT * FROM chats ORDER BY created_at DESC`)
    .all() as ChatRow[];

  return chats.map((chat) => ({
    id: chat.id,
    createdAt: new Date(chat.created_at),
  }));
}

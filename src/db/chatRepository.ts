import { Message } from "ai";
import { generateId } from "ai";
import { pool, dbInit } from "./schema";

// Define types for database rows
interface ChatRow {
  id: string;
  created_at: Date;
  embedding?: number[];
}

interface MessageRow {
  id: string;
  chat_id: string;
  role: string;
  content: string;
  created_at: Date;
}

// Function to create a new chat
export async function createChat(embedding?: number[]): Promise<string> {
  await dbInit;
  const id = generateId();
  const now = new Date();

  await pool.query(
    "INSERT INTO chats (id, created_at, embedding) VALUES ($1, $2, $3)",
    [id, now, embedding ? embedding : null]
  );

  return id;
}

// Function to load a chat and its messages
export async function loadChat(id: string): Promise<Message[]> {
  await dbInit;
  const chatResult = await pool.query("SELECT * FROM chats WHERE id = $1", [
    id,
  ]);

  if (chatResult.rows.length === 0) {
    throw new Error(`Chat with ID ${id} not found`);
  }

  const messagesResult = await pool.query(
    "SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC",
    [id]
  );

  return messagesResult.rows.map((msg: MessageRow) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
    createdAt: msg.created_at,
  }));
}

// Function to save a chat with its messages
export async function saveChat({
  id,
  messages,
  embedding,
}: {
  id: string;
  messages: Message[];
  embedding?: number[];
}): Promise<void> {
  await dbInit;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check if chat exists, if not create it
    const chatResult = await client.query("SELECT * FROM chats WHERE id = $1", [
      id,
    ]);

    if (chatResult.rows.length === 0) {
      await client.query(
        "INSERT INTO chats (id, created_at, embedding) VALUES ($1, $2, $3)",
        [id, new Date(), embedding ? embedding : null]
      );
    } else if (embedding) {
      // Update embedding if provided
      await client.query("UPDATE chats SET embedding = $1 WHERE id = $2", [
        embedding,
        id,
      ]);
    }

    // Delete existing messages for this chat
    await client.query("DELETE FROM messages WHERE chat_id = $1", [id]);

    // Insert all messages
    for (const message of messages) {
      await client.query(
        "INSERT INTO messages (id, chat_id, role, content, created_at) VALUES ($1, $2, $3, $4, $5)",
        [
          message.id,
          id,
          message.role,
          message.content,
          message.createdAt ? new Date(message.createdAt) : new Date(),
        ]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Function to delete a chat
export async function deleteChat(id: string): Promise<void> {
  await dbInit;
  await pool.query("DELETE FROM chats WHERE id = $1", [id]);
}

// Function to list all chats
export async function listChats(): Promise<
  { id: string; createdAt: Date; embedding?: number[] }[]
> {
  await dbInit;
  const result = await pool.query(
    "SELECT * FROM chats ORDER BY created_at DESC"
  );

  return result.rows.map((chat: ChatRow) => ({
    id: chat.id,
    createdAt: chat.created_at,
    embedding: chat.embedding,
  }));
}

// Function to search for similar chats based on embedding
export async function searchSimilarChats(
  embedding: number[],
  limit: number = 5
): Promise<{ id: string; createdAt: Date; similarity: number }[]> {
  await dbInit;
  const result = await pool.query(
    `SELECT id, created_at, embedding <-> $1 as similarity
     FROM chats
     WHERE embedding IS NOT NULL
     ORDER BY similarity ASC
     LIMIT $2`,
    [embedding, limit]
  );

  return result.rows.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    similarity: row.similarity,
  }));
}

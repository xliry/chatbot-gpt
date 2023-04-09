import { Message } from "@/types";
import db from "./dbUtils";

export interface ConversationRequestBody {
  messages: Message[];
  uniqueId: string;
  ipAddress: string;
}

export async function saveConversation(
  conversation: ConversationRequestBody
): Promise<void> {
  try {
    const userId = await createUser(conversation.uniqueId);
    const conversationId = await createConversation(userId);

    for (const message of conversation.messages) {
      await createMessage(conversationId, userId, message);
    }

    console.log("Conversation saved to database.");
  } catch (error) {
    console.error("Error occurred while saving conversation:", error);
  }
}

async function createUser(uniqueId: string): Promise<number> {
  const query = `
    INSERT INTO users (user_id, created_at)
    VALUES (?, NOW())
    ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)
  `;

  const [result] = await db.execute(query, [uniqueId]);
  return (result as any).insertId;
}

async function createConversation(userId: number): Promise<number> {
  const query = `
    INSERT INTO conversations (user_id, start_time)
    VALUES (?, NOW())
  `;

  const [result] = await db.execute(query, [userId]);
  return (result as any).insertId;
}

async function createMessage(
  conversationId: number,
  userId: number,
  message: Message
): Promise<void> {
  const query = `
    INSERT INTO messages (conversation_id, user_id, message_type, content, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  const messageType = message.role === "assistant" ? "text" : "user_text";
  const userIdOrNull = message.role === "assistant" ? null : userId;

  await db.execute(query, [
    conversationId,
    userIdOrNull,
    messageType,
    message.content
  ]);
}

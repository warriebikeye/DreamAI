// src/conversationStore.ts
import Conversation, { IConversation } from "./models/Conversation";

interface IMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Get conversation by userId from MongoDB
export async function getConversation(userId: string): Promise<IMessage[]> {
  const conversation = await Conversation.findOne({ userId });
  return conversation ? conversation.messages : [];
}

// Append message to conversation or create new one if not exists
export async function appendMessage(userId: string, message: IMessage): Promise<void> {
  const conversation = await Conversation.findOne({ userId });

  if (conversation) {
    conversation.messages.push(message);
    await conversation.save();
  } else {
    await Conversation.create({ userId, messages: [message] });
  }
}

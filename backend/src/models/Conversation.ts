// src/models/Conversation.ts
import mongoose, { Schema, Document } from "mongoose";

interface IMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface IConversation extends Document {
  userId: string;
  messages: IMessage[];
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, enum: ["user", "assistant", "system"], required: true },
  content: { type: String, required: true },
});

const ConversationSchema = new Schema<IConversation>(
  {
    userId: { type: String, required: true, unique: true },
    messages: { type: [MessageSchema], default: [] },
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);

export default Conversation;

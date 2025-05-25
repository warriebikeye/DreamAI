// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  userId: string; // UUID string or ObjectId string
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;

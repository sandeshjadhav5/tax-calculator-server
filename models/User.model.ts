import mongoose, { Document, Model, Schema } from "mongoose";

export interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema: Schema<UserInterface> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

const UserModel: Model<UserInterface> = mongoose.model<UserInterface>(
  "user",
  userSchema
);

export { UserModel };

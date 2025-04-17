// models/userModel.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '../types/user';

export interface IUserDocument extends IUser, Document {
  createdAt?: Date;
  updatedAt?: Date;
  _id: string; // now you control how `_id` appears
}

const userSchema: Schema = new Schema<IUserDocument>(
  {
    login: { type: String, required: true, unique: true },
    name: String,
    username: { type: String, required: true },
    location: String,
    avatar: String,
    blog: String,
    bio: String,
    public_repos: Number,
    public_gists: Number,
    followers: Number,
    following: Number,
    github_created_at: Date,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema);
export default UserModel;

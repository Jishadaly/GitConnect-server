// models/friendModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IFriendDocument extends Document {
  user: mongoose.Types.ObjectId;
  friends: Array<{
    login: string;
    avatar: string;
    type: string;
  }>;
}

const friendSchema: Schema = new Schema<IFriendDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    friends: [
      {
        _id: false, // Disable automatic _id for subdocuments
        login: { type: String, required: true },
        avatar: { type: String, required: true },
        type: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const FriendModel = mongoose.model<IFriendDocument>('Friend', friendSchema);
export default FriendModel;
import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
    userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    connectedLogin: { type: String, required: true },
});

export const Connection = mongoose.model('Connection', connectionSchema);

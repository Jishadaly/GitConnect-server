"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(process.env.MONGO_URI || '')
    .then(() => {
    console.log('MongoDB connected');
    app_1.default.listen(process.env.PORT || 5000, () => console.log('Server running'));
})
    .catch((err) => console.error('DB connection error:', err));

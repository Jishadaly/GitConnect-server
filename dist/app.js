"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const reqValidtionErr_1 = require("./utils/reqValidtionErr");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: '*', // Allow requests from this frontend URL
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT'], // Allow the necessary HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: false, // If you're sending cookies or authentication tokens, this should be true
};
app.use((0, cors_1.default)(corsOptions)); // Use CORS with custom options
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/users', userRoute_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.log(err);
    if (err instanceof reqValidtionErr_1.RequestValidationError) {
        // Custom validation error
        return res.status(err.statusCode).json({
            errors: err.serializeError(),
        });
    }
    if (err instanceof reqValidtionErr_1.NotFoundError) {
        // Not found error
        return res.status(err.statusCode).json({
            message: err.message
        });
    }
    // Generic error handling
    const statusCode = err instanceof reqValidtionErr_1.CustomErr ? err.statusCode : 500;
    const message = err instanceof reqValidtionErr_1.CustomErr ? err.message : 'Internal server error';
    return res.status(statusCode).json({ message });
});
exports.default = app;

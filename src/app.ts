// src/app.ts
import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/userRoute';
import { RequestValidationError } from './utils/reqValidtionErr';
import cors from 'cors';


const app = express();
const corsOptions = {
    origin: '*', // Allow requests from this frontend URL
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT'], // Allow the necessary HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: false, // If you're sending cookies or authentication tokens, this should be true
};

app.use(cors(corsOptions)); // Use CORS with custom options


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(
    (err: Error, req: Request, res: Response, next: NextFunction): any => {
        if (err instanceof RequestValidationError) {
            // Custom validation error
            return res.status(err.statusCode).json({
                errors: err.serializeError(),
            });
        }

        // Generic error handling
        return res.status(500).json({ message: 'Internal server error' });
    }
);

export default app;

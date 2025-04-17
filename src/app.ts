// src/app.ts
import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/userRoute';
import { NotFoundError, RequestValidationError , CustomErr } from './utils/reqValidtionErr';
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
        console.log(err)
        if (err instanceof RequestValidationError) {
            // Custom validation error
            return res.status(err.statusCode).json({
                errors: err.serializeError(),
            });
        }

        if (err instanceof NotFoundError) {
            // Not found error
            return res.status(err.statusCode).json({
                message: err.message
            });
        }


        // Generic error handling
        const statusCode = err instanceof CustomErr ? err.statusCode : 500;
        const message = err instanceof CustomErr ? err.message : 'Internal server error';
        
        
        return res.status(statusCode).json({ message });
    }
);

export default app;

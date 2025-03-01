import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';

dotenv.config();
const port = process.env.PORT || 6000;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);


app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

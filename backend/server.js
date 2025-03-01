import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import Pusher from 'pusher';

dotenv.config();

connectDB();

const app = express();

// CORS configuration to allow only the frontend URL
app.use(
  cors({
    origin: "https://university-frontend-six.vercel.app", // Replace with your actual frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "X-CSRF-Token", 
      "X-Requested-With", 
      "Accept", 
      "Content-Type", 
      "Authorization"
    ],
    credentials: true, // Allow cookies to be sent
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);

// Test route to confirm the API is working
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Pusher configuration
const pusher = new Pusher({
  appId: '1950378',
  key: 'd515d193601eae0c654b',
  secret: 'dd23b42147e7b02e4f9c',
  cluster: 'mt1',
  useTLS: true,
});

// Example of triggering an event using Pusher
pusher.trigger('monta-channel', 'mad-monta', {
  message: 'hello monta',
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Export the app for Vercel
export default app;

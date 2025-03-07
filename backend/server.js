import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js'; 
import { notFound, errorHandler } from './middleware/errorMiddleware.js'; 
import userRoutes from './routes/userRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';

dotenv.config();

connectDB();

const app = express();

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization');
  
  // Handle OPTIONS requests for preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  
  return await fn(req, res);
};


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const allowedOrigin = '*'; 
app.use(cors({
  origin: allowedOrigin,     
  credentials: true,          
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'] 
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ideas', ideaRoutes);

// Example route to test the server
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Error handling middleware
app.use(notFound); 
app.use(errorHandler); 

// Start the server
app.listen(7000, () => {
  console.log('Server is running on port 7000');
});

export default app;

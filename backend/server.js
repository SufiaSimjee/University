import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js'; // Assuming you have a MongoDB connection config file
import { notFound, errorHandler } from './middleware/errorMiddleware.js'; // Error handling middleware
import userRoutes from './routes/userRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';

dotenv.config();


connectDB();

const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const allowedOrigin = 'https://university-frontend-six.vercel.app'; 
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


app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});


app.use(notFound); 
app.use(errorHandler); 

app.listen(7000, () => {
  console.log('Server is running on port 7000');
});


export default app;

import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';
import Pusher from 'pusher';

dotenv.config();

connectDB();

const app = express();

// const allowedOrigins = [
//   'https://university-frontend-six.vercel.app',
//   'http://localhost:5173',
// ];

// Middleware
// app.use(
//   cors({
//     origin: 'http://localhost:7173', 
//     origin: 'https://university-frontend-six.vercel.app', 
//     credentials: true, 
//   })
// );

// app.use(
//   cors({
//     origin: (origin, callback) => {
    
//       if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'), false);
//       }
//     },
//     credentials: true, 
//   })
// );

// CORS middleware
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  return await fn(req, res);
};

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(allowCors);

// Routes
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users/ideas', ideaRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.listen(7000, () => {
  console.log('Server is running on port 7000');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);


export default app;

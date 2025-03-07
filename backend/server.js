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

const allowedOrigins = [
  'https://university-frontend-six.vercel.app',
  'http://localhost:5173', 
];

// Middleware
// app.use(
//   cors({
//     origin: 'http://localhost:7173', 
//     origin: 'https://university-frontend-six.vercel.app', 
//     credentials: true, 
//   })
// );

app.use(
  cors({
    origin: (origin, callback) => {
    
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true, 
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

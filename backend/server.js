import path from 'path';
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
import reportRoutes from './routes/reportRoutes.js';
import fileDownloadRoutes from './routes/fileDownloadRoutes.js';
import closureDateRoutes from './routes/clouserDateRoutes.js';
import ideaReportRoutes from './routes/ideaReportRoutes.js';

dotenv.config();
connectDB();

const app = express();

//List of allowed frontend URLs
// const allowedOrigins = [
//   'http://localhost:5173',
//   '*'
// ];

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

app.use(cors()); 

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/download', fileDownloadRoutes);
app.use('/api/closuredates', closureDateRoutes);
app.use('/api/ideareports', ideaReportRoutes);

// multipart/form-data
app.use("/uploads", express.static("uploads"));
// app.use('/api/upload', uploadRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  const __dirname = path.resolve();
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;

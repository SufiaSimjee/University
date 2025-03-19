import multer from 'multer';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

//  GridFSBucket 
const storage = multer.memoryStorage();

//  fileFilter
const fileFilter = (req, file, cb) => {
  console.log("File MIME Type: ", file.mimetype); // Log the MIME type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
    'application/vnd.ms-powerpoint', 
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images in png, jpeg, and gif, PDFs, and Word documents are allowed.'));
  }
};

//  upload
// only 5 files and 10mb is allowed to upload
const upload = multer({
  storage: storage,
  limits: {
    files: 5, 
    fileSize: 10 * 1024 * 1024, 
  },
  fileFilter: fileFilter
});

export default upload;

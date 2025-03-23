import mongoose from 'mongoose';
import Idea from '../models/ideaModel.js';
import User from '../models/userModel.js';
import Category from '../models/categoryModel.js';
import Department from '../models/departmentModel.js';
import archiver from 'archiver';
import { format } from '@fast-csv/format'; 
import { GridFSBucket } from 'mongodb';
import asyncHandler from '../middleware/asyncHandler.js';

const { connection } = mongoose;
let gfsBucket;

// Initialize gfsBucket once the connection is established
connection.once('open', () => {
  gfsBucket = new GridFSBucket(connection.db, { bucketName: 'uploads' });
});

//@desc download zip file
//@route POST /api/ideas/downloadzi[]
//@access Private Admin , QA Manager
const downloadAllFilesAsZip = async (req, res) => {
  try {
    if (!gfsBucket) {
      return res.status(500).json({ message: 'GridFS bucket not initialized' });
    }

    const files = await connection.db.collection('uploads.files').find().toArray();

    if (!files.length) {
      return res.status(404).json({ message: 'No files found in the collection' });
    }

    res.setHeader('Content-Disposition', 'attachment; filename=all_files.zip');
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    files.forEach((file) => {
      const downloadStream = gfsBucket.openDownloadStream(file._id);
      archive.append(downloadStream, { name: file.filename });
    });

    archive.finalize();
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//@desc download csv file
//@route POST /api/ideas/downloadcsv
//@access Private Admin , QA Manager
const downloadcsv = async (req, res) => {
    try {
        const ideas = await Idea.find({}, { fileUrls: 0, __v: 0 })
            .lean()
            .populate('category', 'name') 
            .populate({
                path: 'userId',
                select: 'fullName departments',
                populate: { path: 'departments', select: 'name' }, 
            })
            .populate({
                path: 'comments.userId',
                select: 'fullName departments',
                populate: { path: 'departments', select: 'name' }, 
            });

        if (!ideas.length) {
            return res.status(404).json({ message: 'No ideas found' });
        }

        res.setHeader('Content-Disposition', 'attachment; filename=ideas.csv');
        res.setHeader('Content-Type', 'text/csv');

        const csvStream = format({ headers: true });
        csvStream.pipe(res);

        ideas.forEach((idea) => {
            csvStream.write({
                _id: idea._id,
                title: idea.title,
                description: idea.description,
                category: idea.category.length > 0
                    ? idea.category.map(cat => cat.name).join(', ')  
                    : 'Uncategorized',
                userFullName: idea.userId?.fullName || 'Unknown User',
                userDepartments: idea.userId?.departments
                    ? idea.userId.departments.map(dept => dept.name).join(', ')
                    : 'No Department',
                upVotesCount: idea.upVotes?.length || 0,  
                downVotesCount: idea.downVotes?.length || 0,  
                comments: idea.comments.length > 0
                    ? idea.comments.map(comment => {
                        return `(${comment.userId?.fullName || 'Anonymous'} [${comment.userId?.departments?.map(dept => dept.name).join(', ') || 'No Department'}]: ${comment.text})`;
                    }).join('; ') 
                    : 'No Comments',
            });
        });

        csvStream.end();
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//@desc download csv file for category
//@route POST /api/ideas/downloadcategorycsv
//@access Private Admin , QA Manager
const downloadcategotycsv = async (req, res) => {
  try {
      const categories = await Category.find({}, { __v: 0 }).lean();

      if (!categories.length) {
          return res.status(404).json({ message: 'No categories found' });
      }

      res.setHeader('Content-Disposition', 'attachment; filename=categories.csv');
      res.setHeader('Content-Type', 'text/csv');

      const csvStream = format({ headers: true });
      csvStream.pipe(res);

      categories.forEach((category) => csvStream.write(category));
      csvStream.end();
  } catch (error) {
      console.error('Error exporting CSV:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

//@desc download csv file for department
//@route POST /api/ideas/downloaddepartmentcsv
//@access Private Admin , QA Manager
const downloaddepartmentcsv = async (req, res) => {
  try {
      const departments = await Department.find({}, { __v: 0 }).lean();

      if (!departments.length) {
          return res.status(404).json({ message: 'No departments found' });
      }

      res.setHeader('Content-Disposition', 'attachment; filename=departments.csv');
      res.setHeader('Content-Type', 'text/csv');

      const csvStream = format({ headers: true });
      csvStream.pipe(res);

      departments.forEach((department) => csvStream.write(department));
      csvStream.end();
  } catch (error) {
      console.error('Error exporting CSV:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

//@desc download csv file for user
//@route POST /api/ideas/downloadusercsvforadmin
//@access Private Admin 
const downloadusercsvforadmin = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0, __v: 0, resetCode: 0, resetCodeExpiration: 0 })
            .populate('departments', 'name') 
            .populate('role', 'name') 
            .lean();

        const filteredUsers = users.filter(user => user.role.name !== 'Admin');

        if (!filteredUsers.length) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
        res.setHeader('Content-Type', 'text/csv');

        const csvStream = format({ headers: true });
        csvStream.pipe(res);

        filteredUsers.forEach((user) => {
            const formattedUser = {
                ...user,
                role: user.role.name, 
                departments: user.departments.map(dept => dept.name).join(', ') || 'N/A'
            };
            csvStream.write(formattedUser);
        });

        csvStream.end();
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//@desc download csv file for user
//@route POST /api/ideas/downloadusercsvforqa
//@access Private Admin , QA Manager
const downloadusercsvforqa = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0, __v: 0, resetCode: 0, resetCodeExpiration: 0 })
            .populate('departments', 'name') 
            .populate('role', 'name') 
            .lean();

        const filteredUsers = users.filter(user => user.role.name !== 'Admin' && user.role.name !== 'QA Manager');

        if (!filteredUsers.length) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
        res.setHeader('Content-Type', 'text/csv');

        const csvStream = format({ headers: true });
        csvStream.pipe(res);

        filteredUsers.forEach((user) => {
            const formattedUser = {
                ...user,
                role: user.role.name, 
                departments: user.departments.map(dept => dept.name).join(', ') || 'N/A'
            };
            csvStream.write(formattedUser);
        });

        csvStream.end();
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { downloadAllFilesAsZip , downloadcsv , downloadcategotycsv , 
         downloaddepartmentcsv , downloadusercsvforadmin ,
         downloadusercsvforqa
        };
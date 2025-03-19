import asyncHandler from '../middleware/asyncHandler.js';
import Idea from '../models/ideaModel.js';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import Department from '../models/departmentModel.js'
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import  Grid  from 'gridfs-stream';
import upload from  '../config/multerConfig.js';
import Category from '../models/categoryModel.js';
import nodemailer from 'nodemailer';
import { text } from 'stream/consumers';
import dotenv from 'dotenv';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import archiver from 'archiver';
import { createObjectCsvWriter } from 'csv-writer';
import gridfsStream from 'gridfs-stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.Node_Email, 
    pass: process.env.Node_Password,   
  },
 
});

// @desc    Create new idea
// @route   POST /api/ideas/create
// @access  Private
const createIdea = asyncHandler(async (req, res) => {
  const { title, description, selectedCategories, isAnonymous, showAllDepartments, agreeToTerms } = req.body;

  // Validate required fields
  if (!title || !description || !selectedCategories || !agreeToTerms) {
    throw new Error("Please fill in all fields");
  }

  const fileUrls = [];
  const bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });

  // Handle file uploads
  if (req.files && req.files.length > 0) {
    for (let i = 0; i < req.files.length; i++) {
      try {
        const file = req.files[i];
        const uploadStream = bucket.openUploadStream(file.originalname, {
          contentType: file.mimetype || "application/octet-stream",
        });
        uploadStream.end(file.buffer);
        fileUrls.push(uploadStream.id);
      } catch (error) {
        throw new Error("File upload failed");
      }
    }
  }

  const newIdea = new Idea({
    title,
    description,
    userId: req.user._id,
    category: selectedCategories,
    isAnonymous,
    agreeToTerms,
    showAllDepartments,
    fileUrls,
  });

  const savedIdea = await newIdea.save();

  if (!savedIdea) {
    throw new Error("Idea could not be created");
  }

  res.status(201).json({
    message: "Idea submitted successfully",
    idea: savedIdea,
  });

  const user = await User.findById(req.user._id).populate("departments").populate("role");

  const qaCoordinatorRole = await Role.findOne({ name: "QA Coordinator" });
  if (!qaCoordinatorRole) {
    console.log("QA Coordinator role not found");
    return;
  }

  const qaCoordinators = await User.find({
    role: qaCoordinatorRole._id, 
  });

  for (let qaCoordinator of qaCoordinators) {
    const mailOptions = {
      from: process.env.Node_Email,
      to: qaCoordinator.email, 
      subject: "New Idea Submitted",
      text: `A new idea has been submitted by ${user.fullName}. Title: ${savedIdea.title}. Description: ${savedIdea.description}`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email to QA Coordinator:", error);
    }
  }
});

// @desc    Get all ideas
// @route   GET /api/ideas
// @access  Private
const getAllIdeas = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('role')  
    .populate('departments');  

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const role = user.role.name;
  

  if (role === 'Admin' || role === 'QA Manager') {
    const ideas = await Idea.find()
      .select('title description category showAllDepartments createdAt , isAnonymous')
      .populate('category', 'name')
      .populate({
        path: 'userId',
        select: 'fullName',
        populate: {
          path: 'departments',
          select: 'name',
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(ideas);
  } else {

  const ideas = await Idea.find()
    .select('title description category showAllDepartments createdAt , isAnonymous')
    .populate('category', 'name')
    .populate({
      path: 'userId',
      select: 'fullName',
      populate: {
        path: 'departments',
        select: 'name',
      },
    })
    .sort({ createdAt: -1 });

  const filteredIdeas = ideas.filter(idea => {
    if (idea.showAllDepartments) return true;

    if (!idea.userId.departments) return false;

    return idea.userId.departments.some(department =>
      user.departments.some(userDepartment =>
        userDepartment._id.toString() === department._id.toString() 
      )
    );
  });

  res.status(200).json(filteredIdeas);
}
});

// @desc    Get popular ideas (top 3 with most upvotes)
// @route   GET /api/ideas/popular
// @access  Private
const getPopularIdeas = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('role')
    .populate('departments');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const role = user.role.name;
  let ideas;

  if (role === 'Admin' || role === 'QA Manager') {
    ideas = await Idea.find()
      .select('title description category showAllDepartments createdAt upVotes , isAnonymous')
      .populate('category', 'name')
      .populate({
        path: 'userId',
        select: 'fullName',
        populate: {
          path: 'departments',
          select: 'name',
        },
      })
      .sort({ upVotes: -1, createdAt: -1 }) 
      .limit(3); 
  } else {
    ideas = await Idea.find()
      .select('title description category showAllDepartments createdAt upVotes , isAnonymous')
      .populate('category', 'name')
      .populate({
        path: 'userId',
        select: 'fullName',
        populate: {
          path: 'departments',
          select: 'name',
        },
      })
      .sort({ upVotes: -1, createdAt: -1 }) 
      .limit(3);

    const filteredIdeas = ideas.filter(idea => {
      if (idea.showAllDepartments) return true;

      if (!idea.userId.departments) return false;

      return idea.userId.departments.some(department =>
        user.departments.some(userDepartment =>
          userDepartment._id.toString() === department._id.toString()
        )
      );
    });

    ideas = filteredIdeas;
  }

  res.status(200).json(ideas);
});

//
const getMostDownvotedIdeas = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('role')
    .populate('departments');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const role = user.role.name;
  let ideas;

  if (role === 'Admin' || role === 'QA Manager') {
    ideas = await Idea.find()
      .select('title description category showAllDepartments createdAt  , isAnonymous')
      .populate('category', 'name')
      .populate({
        path: 'userId',
        select: 'fullName',
        populate: {
          path: 'departments',
          select: 'name',
        },
      })
      .sort({ downVotes: -1, createdAt: -1 }) 
      .limit(3); 
  } else {
    ideas = await Idea.find()
      .select('title description category showAllDepartments createdAt downVotes , isAnonymous')
      .populate('category', 'name')
      .populate({
        path: 'userId',
        select: 'fullName',
        populate: {
          path: 'departments',
          select: 'name',
        },
      })
      .sort({ downVotes: -1, createdAt: -1 }) 
      .limit(3); 

    const filteredIdeas = ideas.filter(idea => {
      if (idea.showAllDepartments) return true;

      if (!idea.userId.departments) return false;

      return idea.userId.departments.some(department =>
        user.departments.some(userDepartment =>
          userDepartment._id.toString() === department._id.toString()
        )
      );
    });

    ideas = filteredIdeas;
  }

  res.status(200).json(ideas);
});

// @desc    Get idea by ID
// @route   GET /api/ideas/:id
// @access  Private
const getIdeaById = asyncHandler(async (req, res) => {
  
  const ideaId = req.params.id;

  const idea = await Idea.findById(ideaId)
  .populate({
    path: 'userId',
    select: 'fullName departments',
    populate: {
      path: 'departments',
      select: 'name', 
    },
  })
    .populate('category', 'name')
    .populate('comments.userId', 'fullName');

  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  const bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads',
  });

  const fileUrls = Array.isArray(idea.fileUrls) ? idea.fileUrls : [];

  const processedFiles = await Promise.all(
    fileUrls.map(async (fileId) => {
      try {
        const fileIdObj = new mongoose.Types.ObjectId(fileId);
        const fileDoc = await bucket.find({ _id: fileIdObj }).toArray();
        const fileName = fileDoc[0]?.filename || 'Unknown File';
        const mimeType = fileDoc[0]?.contentType || 'application/octet-stream';

        const downloadStream = bucket.openDownloadStream(fileIdObj);

        let chunks = [];
        for await (const chunk of downloadStream) {
          chunks.push(chunk);
        }

        const fileBuffer = Buffer.concat(chunks);
        const fileBase64 = fileBuffer.toString('base64');

        return {
          fileName: fileName,
          mimeType: mimeType,
          fileUrl: `data:${mimeType};base64,${fileBase64}`,
        };
      } catch (error) {
        throw new Error('Error processing files');
      }
    })
  );

  const formattedIdea = {
    ...idea.toObject(),
    fileUrls: processedFiles.filter((url) => url !== null),
  };

  res.status(200).json(formattedIdea);
});

// @desc    DELETE an idea
// @route   DELETE /api/ideas/:ideaId
// @access  Private
const deleteIdea = asyncHandler(async (req, res) => {
  const ideaId = req.params.ideaId;
  try {
    const idea = await Idea.findByIdAndDelete(ideaId);
    if (!idea) {
      res.status(404);
      throw new Error('Idea not found');
    }

    res.status(200).json({ message: 'Idea deleted successfully' });
  } catch (error) {
    res.status(500);
    throw new Error('Idea could not be deleted');
  }
});

// @desc    Create new comment
// @route   POST /api/ideas/comment/create/:id
// @access  Private
// @desc    Create new comment
// @route   POST /api/ideas/comment/create/:id
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const ideaId = req.params.id;
  const { userId, text, isAnonymous } = req.body;

  const idea = await Idea.findById(ideaId);
  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  const ideaOwner = await User.findById(idea.userId);
  if (!ideaOwner) {
    res.status(404);
    throw new Error('Idea owner not found');
  }

  const commentUser = await User.findById(userId);
  if (!commentUser) {
    res.status(404);
    throw new Error('Comment user not found');
  }

  const newComment = {
    userId,
    text,
    isAnonymous: isAnonymous || false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await Idea.updateOne(
    { _id: ideaId },
    { $push: { comments: newComment } }
  );

  if (result.modifiedCount === 0) {
    res.status(404);
    throw new Error('Idea not found or comment not added');
  }

  res.status(201).json({
    message: 'Comment added successfully',
    comment: newComment,
  });

  try {
    const mailOptions = {
      from: process.env.Email,
      to: ideaOwner.email,
      subject: `New Comment on Your Idea: ${idea.title}`,
      text: `Hello ${ideaOwner.name},\n\nYou have received a new comment on your idea titled "${idea.title}".\n\nComment: ${text}\n\nBest regards,\n University`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email notification sent to idea owner.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
});

// @desc    Get all comments
// @route   GET /api/ideas/comments/:id
// @access  Private
const getCommentsByIdeaId = asyncHandler(async (req, res) => {
  const ideaId = req.params.id;

  try {
    const idea = await Idea.findById(ideaId).select('comments').lean(); 

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    const sortedComments = idea.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(sortedComments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a comment
// @route   Put /api/ideas/comments/:ideaId/:commentId
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const { ideaId, commentId } = req.params;
  const text = req.body.text;
  try {
    const idea = await Idea.findById(ideaId);
    const comment = idea.comments.id(commentId);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }
    // Update the comment text and the updatedAt field
    comment.text = text || comment.text;
    comment.updatedAt = new Date();

    // Save the updated idea document
    await idea.save();

    // Send back the updated comment
    res.status(200).json({
      message: 'Comment updated successfully',
      comment,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Comment could not be updated');
  }
});

// @desc    Delete a comment
// @route   Delete /api/ideas/comments/:ideaId/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const { ideaId, commentId } = req.params;
  const text = req.body.text;
  try {
    const idea = await Idea.findById(ideaId);
    const comment = idea.comments.id(commentId);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }
    // Remove the comment
    idea.comments.pull(commentId);

    // Save the updated idea document
    await idea.save();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500);
    throw new Error('Comment could not be deleted');
  }
});

// @desc    Upvote an idea
// @route   POST /api/ideas/upVotes/:ideaId/:userId
// @access  Private
const upVoteIdea = asyncHandler(async (req, res) => {
  try {
    const { ideaId, userId } = req.params;
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      res.status(404);
      throw new Error('Idea not found');
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    // Check if the user has already upVoted the idea
    if (idea.upVotes.includes(userId)) {
      res.status(200).json({ message: 'User has already upVoted this idea' });
    } else {
      // Add the user to the upVotes array
      await Idea.updateOne({ _id: ideaId }, { $push: { upVotes: userId } });
      res.status(200).json({ message: 'Upvote added successfully' });
    }

    // Check if the user has downVoted the idea
    if (idea.downVotes.includes(userId)) {
      // Remove the downvote
      await Idea.updateOne({ _id: ideaId }, { $pull: { downVotes: userId } });
    }
  } catch (error) {
    res.status(500);
    throw new Error('Upvote could not be added');
  }
});

// @desc    Upvote an idea
// @route   POST /api/ideas/downVotes/:ideaId/:userId
// @access  Private
const downVoteIdea = asyncHandler(async (req, res) => {
  try {
    const { ideaId, userId } = req.params;
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      res.status(404);
      throw new Error('Idea not found');
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    // Check if the user has already downVoted the idea
    if (idea.downVotes.includes(userId)) {
      res.status(200).json({ message: 'User has already downVoted this idea' });
    } else {
      // Add the user to the downVotes array
      await Idea.updateOne({ _id: ideaId }, { $push: { downVotes: userId } });
      res.status(200).json({ message: 'Downvote added successfully' });
    }

    // Check if the user has upVoted the idea
    if (idea.upVotes.includes(userId)) {
      // Remove the upvote
      await Idea.updateOne({ _id: ideaId }, { $pull: { upVotes: userId } });
    }
  } catch (error) {
    res.status(500);
    throw new Error('Downvote could not be added');
  }
});

// @desc    download all ideas
// @route   POST /api/ideas/download/export
// @access  Private
// const downloadIdeas = async (req, res) => {
//   try {
//     const ideas = await Idea.find()
//       .populate('userId', 'fullName') 
//       .populate('category', 'name'); 
//     if (!ideas || ideas.length === 0) {
//       return res.status(404).json({ message: 'No ideas found' });
//     }

//     const formattedIdeas = ideas.map((idea) => ({
//       title: idea.title,
//       description: idea.description,
//       category: idea.category?.map(cat => cat.name).join(', ') || 'Uncategorized', 
//       isAnonymous: idea.isAnonymous ? 'Yes' : 'No',
//       showAllDepartments: idea.showAllDepartments ? 'Yes' : 'No',
//       createdAt: idea.createdAt.toISOString(),
//       userFullName: idea.userId?.fullName || 'Anonymous', 
//     }));

//     const csvPath = path.join(__dirname, 'ideas.csv');

//     const csvWriter = createObjectCsvWriter({
//       path: csvPath,
//       header: [
//         { id: 'title', title: 'Title' },
//         { id: 'description', title: 'Description' },
//         { id: 'category', title: 'Category' },
//         { id: 'isAnonymous', title: 'Anonymous' },
//         { id: 'showAllDepartments', title: 'Show All Departments' },
//         { id: 'createdAt', title: 'Created At' },
//         { id: 'userFullName', title: 'User Full Name' },
//       ],
//     });

//     await csvWriter.writeRecords(formattedIdeas);

//     const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
//     const files = await bucket.find().toArray();

//     if (files.length > 0) {
//       const zipPath = path.join(__dirname, 'download.zip');
//       const output = fs.createWriteStream(zipPath);
//       const archive = archiver('zip', { zlib: { level: 9 } });

//       output.on('close', () => {
//         res.download(zipPath, 'download.zip', (err) => {
//           if (err) {
//             console.error('Error sending zip file', err);
//           }
//           fs.unlinkSync(zipPath); 
//           fs.unlinkSync(csvPath); 
//         });
//       });

//       archive.pipe(output);
//       archive.file(csvPath, { name: 'ideas.csv' });
//       for (const file of files) {
//         const fileStream = bucket.openDownloadStream(file._id);
//         archive.append(fileStream, { name: file.filename });
//       }

//       archive.finalize();
//     } else {
//       res.download(csvPath, 'ideas.csv', (err) => {
//         if (err) {
//           console.error('Error sending CSV file', err);
//         }
//         fs.unlinkSync(csvPath); 
//       });
//     }
//   } catch (error) {
//     console.error('Error generating CSV/zip file:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const downloadIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find()
      .populate('userId', 'fullName')
      .populate('category', 'name');

    if (!ideas || ideas.length === 0) {
      return res.status(404).json({ message: 'No ideas found' });
    }

    const formattedIdeas = ideas.map((idea) => ({
      title: idea.title,
      description: idea.description,
      category: idea.category?.map(cat => cat.name).join(', ') || 'Uncategorized',
      isAnonymous: idea.isAnonymous ? 'Yes' : 'No',
      showAllDepartments: idea.showAllDepartments ? 'Yes' : 'No',
      createdAt: idea.createdAt.toISOString(),
      userFullName: idea.userId?.fullName || 'Anonymous',
    }));

    const csvPath = path.join(__dirname, 'ideas.csv');

    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'title', title: 'Title' },
        { id: 'description', title: 'Description' },
        { id: 'category', title: 'Category' },
        { id: 'isAnonymous', title: 'Anonymous' },
        { id: 'showAllDepartments', title: 'Show All Departments' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'userFullName', title: 'User Full Name' },
      ],
    });

    await csvWriter.writeRecords(formattedIdeas);

    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    const files = await bucket.find().toArray();

    if (files.length > 0) {
      // If ZIP file is requested
      const zipPath = path.join(__dirname, 'files.zip');
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        // If both files requested
        if (req.query.zipOnly) {
          res.download(zipPath, 'files.zip', (err) => {
            if (err) {
              console.error('Error sending zip file', err);
            }
            fs.unlinkSync(zipPath);
          });
        } else {
          // If both CSV and ZIP requested, send them in sequence
          res.zip([
            { path: csvPath, name: 'ideas.csv' },
            { path: zipPath, name: 'files.zip' }
          ], (err) => {
            if (err) {
              console.error('Error sending zip and CSV file', err);
            }
            fs.unlinkSync(zipPath);
            fs.unlinkSync(csvPath);
          });
        }
      });

      archive.pipe(output);
      archive.file(csvPath, { name: 'ideas.csv' });
      for (const file of files) {
        const fileStream = bucket.openDownloadStream(file._id);
        archive.append(fileStream, { name: file.filename });
      }

      archive.finalize();
    } else {
      // If no files in the ZIP but CSV is requested
      res.download(csvPath, 'ideas.csv', (err) => {
        if (err) {
          console.error('Error sending CSV file', err);
        }
        fs.unlinkSync(csvPath);
      });
    }
  } catch (error) {
    console.error('Error generating CSV/zip file:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  createComment,
  createIdea,
  deleteComment,
  deleteIdea,
  downVoteIdea,
  getAllIdeas,
  getIdeaById,
  getCommentsByIdeaId,
  updateComment,
  upVoteIdea,
  getPopularIdeas,
  getMostDownvotedIdeas,
  downloadIdeas
};

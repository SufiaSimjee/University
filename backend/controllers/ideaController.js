import asyncHandler from '../middleware/asyncHandler.js';
import Idea from '../models/ideaModel.js';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import Department from '../models/departmentModel.js';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import  Grid  from 'gridfs-stream';
import upload from  '../config/multerConfig.js';
import Category from '../models/categoryModel.js';
import nodemailer from 'nodemailer';
import { text } from 'stream/consumers';
import dotenv from 'dotenv';

import stream from 'stream';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import archiver from 'archiver';
import {createObjectCsvWriter} from 'csv-writer';
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

  console.log(user);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const role = user.role.name;

  if (role === 'Admin' || role === 'QA Manager') {
    const ideas = await Idea.find()
      .select('title description category showAllDepartments createdAt isAnonymous')
      .populate('category', 'name')
      .populate({
        path: 'userId',
        select: 'fullName isActive',
        populate: {
          path: 'departments',
          select: 'name',
        },
      })
      .sort({ createdAt: -1 });

    const activeIdeas = ideas.filter(idea => idea.userId.isActive);

    return res.status(200).json(activeIdeas);
  } else {
    const ideas = await Idea.find()
      .select('title description category showAllDepartments createdAt isAnonymous')
      .populate('category', 'name')
      .populate({
        path: 'userId',
        select: 'fullName isActive',
        populate: {
          path: 'departments',
          select: 'name',
        },
      })
      .sort({ createdAt: -1 });

    const filteredIdeas = ideas.filter(idea => {
      if (idea.showAllDepartments) return true;

      if (!idea.userId.departments) return false;

      const isActive = idea.userId.isActive;
      if (!isActive) return false;

      return idea.userId.departments.some(department =>
        user.departments.some(userDepartment =>
          userDepartment._id.toString() === department._id.toString() 
        )
      );
    });

    res.status(200).json(filteredIdeas);
  }
});


// @desc    Get all ideas of the logged-in user
// @route   GET /api/ideas/myideas
// @access  Private
const getMyIdeas = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const ideas = await Idea.find({ userId }) 
    .select('title description category showAllDepartments createdAt isAnonymous')
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

  res.status(200).json(ideas);
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

// @desc    Get most downvoted ideas (top 3 with most downvotes)
// @route   GET /api/ideas/mostdownvoted
// @access  Private
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
    .populate('comments.userId', 'fullName isActive'); 

  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  const filteredComments = idea.comments.filter(
    (comment) => comment.userId && comment.userId.isActive
  );

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
    comments: filteredComments,
    fileUrls: processedFiles.filter((url) => url !== null),
  };

  res.status(200).json(formattedIdea);
});

// @desc    DELETE an idea
// @route   DELETE /api/ideas/:ideaId
// @access  Private
const deleteIdea = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const idea = await Idea.findById(id);
  
  if (!idea) {
    return res.status(404).json({ message: 'Idea not found' });
  }

  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
  idea.fileUrls.forEach(async (fileId) => {
    await bucket.delete(new mongoose.Types.ObjectId(fileId)).catch(err => console.error(`Failed to delete file ${fileId}: ${err.message}`));
  });

  await Idea.findByIdAndDelete(id);
  res.json({ message: 'Idea deleted successfully' });
});


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
      text: `Hello ${ideaOwner.fullName},\n\nYou have received a new comment on your idea titled "${idea.title}".\n\nComment: ${text}\n\nBest regards,\n University`,
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


// @desc    Edit an existing idea
// @route   PUT /api/ideas/editidea/:id
// @access  Private
const editIdea = asyncHandler(async (req, res) => {
  const { title, description, selectedCategories, isAnonymous, showAllDepartments, agreeToTerms } = req.body;
  const { id } = req.params;
  const idea = await Idea.findById(id);

  if (!idea) {
    throw new Error("Idea not found");
  }

  const fileUrls = [];
  const bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });

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

  if (title) idea.title = title;
  if (description) idea.description = description;
  if (selectedCategories) idea.category = selectedCategories;
  if (isAnonymous !== undefined) idea.isAnonymous = isAnonymous;
  if (showAllDepartments !== undefined) idea.showAllDepartments = showAllDepartments;
  if (agreeToTerms !== undefined) idea.agreeToTerms = agreeToTerms;
  if (fileUrls.length > 0) idea.fileUrls = fileUrls; 

  const updatedIdea = await idea.save();

  if (!updatedIdea) {
    throw new Error("Idea could not be updated");
  }

  res.status(200).json({
    message: "Idea updated successfully",
    idea: updatedIdea,
  });
});

// @desc    Delete all files associated with an idea
// @route   DELETE /api/ideas/delete/idea/files/:id
// @access  Private
const deleteIdeaFilesById = asyncHandler(async (req, res) => {
  const ideaId = req.params.id;

  const idea = await Idea.findById(ideaId);
  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  const db = mongoose.connection.db;
  const bucket = new GridFSBucket(db, {
    bucketName: 'uploads',
  });

  const fileUrls = idea.fileUrls || [];

  for (const fileId of fileUrls) {
    try {
      await bucket.delete(new mongoose.Types.ObjectId(fileId));
    } catch (error) {
      console.error(`Error deleting file with ID ${fileId}:`, error.message);
    }
  }

  idea.fileUrls = [];
  await idea.save();

  res.status(200).json({ message: 'All files for the idea have been deleted successfully.' });
});

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
  getMyIdeas,
  editIdea,
  deleteIdeaFilesById,
};

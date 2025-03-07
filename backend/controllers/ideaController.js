import asyncHandler from '../middleware/asyncHandler.js';
import Idea from '../models/ideaModel.js';
import User from '../models/userModel.js';
import Category from '../models/categoryModel.js';
import Pusher from 'pusher';

// @desc    Create new idea
// @route   POST /api/users/idea/create
// @access  Private
export const createIdea = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    userId,
    isAnonymous,
    file,
    agreeToTerms,
    upVotes,
    downVotes,
  } = req.body;
  const idea = await Idea.create({
    title,
    description,
    category: category || [],
    userId: "67ca7b34d1164f545b7a1fb0",
    isAnonymous: isAnonymous || false,
    file: file || [],
    agreeToTerms,
    upVotes: upVotes || [],
    downVotes: downVotes || [],
  });
  if (idea) {
    res.status(201).json(idea);
  } else {
    res.status(400);
    throw new Error('Invalid idea data');
  }
});

// export default {createIdea};
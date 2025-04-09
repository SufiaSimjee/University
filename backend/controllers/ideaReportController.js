import asyncHandler from '../middleware/asyncHandler.js';
import Idea from '../models/ideaModel.js';
import User from '../models/userModel.js';
import Report from '../models/reportModel.js';
import mongoose from 'mongoose';

// @desc    Report an idea
// @route   POST /api/ideareports
// @access  Private
const reportIdea = asyncHandler(async (req, res) => {
    const { ideaId, reason, message } = req.body;
    const userId = req.user._id; 
  
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      res.status(404);
      throw new Error('Idea not found');
    }
  
    const alreadyReported = await Report.findOne({ ideaId, reportedBy: userId });
    if (alreadyReported) {
      res.status(400);
      throw new Error('You have already reported this idea');
    }
  
    const report = new Report({
      ideaId,
      reportedBy: userId,
      reason,
      message,
    });
  
    await report.save();
  
    res.status(201).json({ message: 'Report submitted successfully' });
  });

// @desc    Get all reports for a specific idea
// @route   GET /api/ideareports/:ideaId
// @access  Admin, QA Manager
const getReportsByIdeaId = asyncHandler(async (req, res) => {
  const { ideaId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(ideaId)) {
    res.status(400);
    throw new Error('Invalid Idea ID');
  }

  const reports = await Report.find({ ideaId })
    .populate('reportedBy', 'fullName')
    .populate('ideaId', 'userId')
    .sort({ createdAt: -1 });

  res.status(200).json(reports);
});

export {
  reportIdea,
  getReportsByIdeaId
};
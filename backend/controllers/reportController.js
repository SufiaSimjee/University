import asyncHandler from '../middleware/asyncHandler.js';
import Idea from '../models/ideaModel.js';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import Department from '../models/departmentModel.js';
import mongoose from 'mongoose';

// @desc Get Statistics Report
// @route GET /api/reports/getNumberOfIdeasByDepartment
// @access Admin, QA Manager
const getIdeasByDepartment = asyncHandler(async (req, res) => {
  try {
    const departmentIdeasCount = await Idea.aggregate([
      {
        $lookup: {
          from: 'users', 
          localField: 'userId',
          foreignField: '_id',
          as: 'user_info',
        },
      },
      {
        $unwind: '$user_info', 
      },
      {
        $unwind: '$user_info.departments', 
      },
      {
        $group: {
          _id: '$user_info.departments', 
          totalIdeas: { $sum: 1 }, 
        },
      },
      {
      
        $lookup: {
          from: 'departments', 
          localField: '_id',
          foreignField: '_id',
          as: 'department_info',
        },
      },
      {
        $unwind: '$department_info', 
      },
      {
        $project: {
          department: '$department_info.name', 
          totalIdeas: 1,
        },
      },
    ]);

    res.status(200).json(departmentIdeasCount); 
  } catch (err) {
    res.status(500).json({ message: 'Server error' }); 
  }
});

// @desc Get Statistics Report
// @route GET /api/reports/getPercentageOfIdeasByDepartment
// @access Admin, QA Manager
const getPercentageOfIdeasByDepartment = asyncHandler(async (req, res) => {
  try {
    const totalIdeasCount = await Idea.countDocuments();

    const departmentIdeasCount = await Idea.aggregate([
      {
        $lookup: {
          from: 'users', 
          localField: 'userId',
          foreignField: '_id',
          as: 'user_info',
        },
      },
      {
        $unwind: '$user_info', 
      },
      {
        $unwind: '$user_info.departments', 
      },
      {
        $group: {
          _id: '$user_info.departments', 
          totalIdeas: { $sum: 1 }, 
        },
      },
      {
        $lookup: {
          from: 'departments', 
          localField: '_id',
          foreignField: '_id',
          as: 'department_info',
        },
      },
      {
        $unwind: '$department_info', 
      },
      {
        $project: {
          department: '$department_info.name', 
          totalIdeas: 1,
          percentage: {
            $multiply: [{ $divide: ['$totalIdeas', totalIdeasCount] }, 100], 
          },
        },
      },
    ]);

    res.status(200).json(departmentIdeasCount); 
  } catch (err) {
    res.status(500).json({ message: 'Server error' }); 
  }
});

// @desc Get Statistics Report
// @route GET /api/reports/getNumberOfContributorsByDepartment
// @access Admin, QA Manager
const getContributorsByDepartment = asyncHandler(async (req, res) => {
  try {
    const departmentContributorsCount = await Idea.aggregate([
      {
        $lookup: {
          from: 'users', 
          localField: 'userId', 
          foreignField: '_id', 
          as: 'user_info', 
        },
      },
      {
        $unwind: '$user_info', 
      },
      {
        $unwind: '$user_info.departments', 
      },
      {
        $group: {
          _id: '$user_info.departments', 
          totalContributors: { $addToSet: '$user_info._id' },  
        },
      },
      {
        $lookup: {
          from: 'departments', 
          localField: '_id', 
          foreignField: '_id', 
          as: 'department_info', 
        },
      },
      {
        $unwind: '$department_info', 
      },
      {
        $project: {
          department: '$department_info.name',
          totalContributors: { $size: '$totalContributors' }, 
        },
      },
    ]);

    res.status(200).json(departmentContributorsCount); 
  } catch (err) {
    res.status(500).json({ message: 'Server error' }); 
  }
});

// @desc Get Statistics Report
// @route GET /api/reports/getanonymousIdeasAndComments
// @access Admin, QA Manager
const getAnonymousIdeasAndComments = asyncHandler(async (req, res) => {
  try {
    // Aggregate anonymous ideas
    const anonymousIdeasCount = await Idea.aggregate([
      {
        $match: { isAnonymous: true },
      },
      {
        $count: 'anonymousIdeas', 
      },
    ]);

    const anonymousCommentsCount = await Idea.aggregate([
      {
        $unwind: '$comments',
      },
      {
        $match: { 'comments.isAnonymous': true }, 
      },
      {
        $group: {
          _id: null, 
          anonymousComments: { $sum: 1 }, 
        },
      },
    ]);

    res.status(200).json({
      anonymousIdeasCount: anonymousIdeasCount.length > 0 ? anonymousIdeasCount[0].anonymousIdeas : 0,
      anonymousCommentsCount: anonymousCommentsCount.length > 0 ? anonymousCommentsCount[0].anonymousComments : 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export { getIdeasByDepartment , 
         getPercentageOfIdeasByDepartment ,
         getContributorsByDepartment,
         getAnonymousIdeasAndComments
        };

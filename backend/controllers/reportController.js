import asyncHandler from '../middleware/asyncHandler.js';
import Idea from '../models/ideaModel.js';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import Department from '../models/departmentModel.js';
import Category from '../models/categoryModel.js';
import mongoose from 'mongoose';

// @desc Get Statistics Report
// @route GET /api/reports/getNumberOfIdeasByDepartment
// @access Admin, QA Manager
const getIdeasByDepartment = asyncHandler(async (req, res) => {
  try {
    const departmentIdeasCount = await Department.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "departments",
          as: "users_info",
        },
      },
      {
        $lookup: {
          from: "ideas",
          localField: "users_info._id",
          foreignField: "userId",
          as: "ideas_info",
        },
      },
      {
        $group: {
          _id: "$_id",
          department: { $first: "$name" },
          totalIdeas: { $sum: { $size: "$ideas_info" } }, 
        },
      },
      {
        $project: {
          department: 1,
          totalIdeas: { $ifNull: ["$totalIdeas", 0] }, 
        },
      },
    ]);

    res.status(200).json(departmentIdeasCount);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc Get Statistics Report
// @route GET /api/reports/getPercentageOfIdeasByDepartment
// @access Admin, QA Manager
const getPercentageOfIdeasByDepartment = asyncHandler(async (req, res) => {
  try {
    const totalIdeasCount = await Idea.countDocuments();

    const departmentIdeasCount = await Department.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "departments",
          as: "users_info",
        },
      },
      {
        $lookup: {
          from: "ideas",
          localField: "users_info._id",
          foreignField: "userId",
          as: "ideas_info",
        },
      },
      {
        $group: {
          _id: "$_id",
          department: { $first: "$name" },
          totalIdeas: { $sum: { $size: "$ideas_info" } }, 
        },
      },
      {
        $project: {
          department: 1,
          totalIdeas: { $ifNull: ["$totalIdeas", 0] },
          percentage: {
            $cond: {
              if: { $eq: [totalIdeasCount, 0] }, 
              then: 0,
              else: { $multiply: [{ $divide: ["$totalIdeas", totalIdeasCount] }, 100] },
            },
          },
        },
      },
    ]);

    res.status(200).json(departmentIdeasCount);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc Get Statistics Report
// @route GET /api/reports/getNumberOfContributorsByDepartment
// @access Admin, QA Manager
const getContributorsByDepartment = asyncHandler(async (req, res) => {
  try {
    const departmentContributorsCount = await Department.aggregate([
   
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "departments",
          as: "users",
        },
      },
     
      {
        $lookup: {
          from: "ideas",
          localField: "users._id",
          foreignField: "userId",
          as: "ideas",
        },
      },
      {
        $addFields: {
          ideaAuthors: {
            $map: {
              input: "$ideas",
              as: "idea",
              in: "$$idea.userId",
            },
          },
        },
      },
      {
        $addFields: {
          commentAuthors: {
            $reduce: {
              input: "$ideas",
              initialValue: [],
              in: { $setUnion: ["$$value", "$$this.comments.userId"] },
            },
          },
        },
      },
      {
        $addFields: {
          contributors: {
            $setUnion: ["$ideaAuthors", "$commentAuthors"],
          },
        },
      },
      {
        $addFields: {
          contributors: {
            $filter: {
              input: "$contributors",
              as: "contributor",
              cond: { $ne: ["$$contributor", null] },
            },
          },
        },
      },
      {
        $project: {
          departmentName: "$name",
          totalContributors: { $size: "$contributors" },
        },
      },
    ]);

    res.status(200).json(departmentContributorsCount);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ message: "Server error" });
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

// @desc Get Statistics Report
// @route GET /api/reports/getIdeasWithoutComments
// @access Admin, QA Manager
const getIdeasWithAndWithoutComments = asyncHandler(async (req, res) => {
  try {
    const ideasCount = await Idea.aggregate([
      {
        $project: {
          hasComments: { $gt: [{ $size: "$comments" }, 0] }, 
        },
      },
      {
        $group: {
          _id: "$hasComments", 
          count: { $sum: 1 }, 
        },
      },
    ]);

    const ideasWithCommentsCount = ideasCount.find(item => item._id === true)?.count || 0;
    const ideasWithoutCommentsCount = ideasCount.find(item => item._id === false)?.count || 0;

    res.status(200).json({
      ideasWithCommentsCount,
      ideasWithoutCommentsCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc Get Statistics Report
// @route GET /api/reports/getCategoryCount
// @access Admin, QA Manager
const getCategoryCount = asyncHandler(async (req, res) => {
  try {
    const categoryCount = await Category.countDocuments();
    res.status(200).json({ totalCategories: categoryCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get Statistics Report
// @route GET /api/reports/getDepartmentCount
// @access Admin, QA Manager
const getDepartmentCount = asyncHandler(async (req, res) => {
  try {
    const departmentCount = await Department.countDocuments();
    res.status(200).json({ totalDepartments: departmentCount });
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
});

// @desc Get Statistics Report
// @route GET /api/reports/getNonAnonymousIdeasCount
// @access Admin, QA Manager
const getNonAnonymousIdeasCount = asyncHandler(async (req, res) => {
  try {
    const nonAnonymousIdeasCount = await Idea.countDocuments({ isAnonymous: false });
    res.status(200).json({ nonAnonymousIdeasCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc Get Statistics Report
// @route GET /api/reports/getAnonymousIdeasCount
// @access Admin, QA Manager
const getAnonymousIdeasCount = asyncHandler(async (req, res) => {
  try {
    const anonymousIdeasCount = await Idea.countDocuments({ isAnonymous: true });
    res.status(200).json({ anonymousIdeasCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc Get Statistics Report
// @route GET /api/reports/getUserIdeasCount
// @access Private
const getUserIdeasCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const ideaCount = await Idea.countDocuments({ userId });
  res.status(200).json({ ideaCount });
});

// @desc Get Statistics Report
// @route GET /api/reports/getDepartmentUserCount
// @access Private QA Coordinator
const getDepartmentUserCount = async (req, res) => {
  try {
    const loggedInUser = req.user; 

    if (!loggedInUser || !loggedInUser.departments || loggedInUser.departments.length === 0) {
      return res.status(400).json({ message: "User has no departments assigned." });
    }

    const departmentIds = loggedInUser.departments.map((dept) => dept._id);

    const userCounts = await User.aggregate([
      { 
        $match: { 
          departments: { $in: departmentIds } 
        } 
      },
      {
        $lookup: {
          from: "roles", 
          localField: "role",
          foreignField: "_id",
          as: "roleInfo",
        },
      },
      { $unwind: "$roleInfo" }, 
      { $match: { "roleInfo.name": { $ne: "QA Coordinator" } } }, 
      { $count: "totalUsers" } 
    ]);

    const totalUsers = userCounts.length > 0 ? userCounts[0].totalUsers : 0;

    res.json({ totalUsers });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { getIdeasByDepartment , 
         getPercentageOfIdeasByDepartment ,
         getContributorsByDepartment,
         getAnonymousIdeasAndComments,
         getIdeasWithAndWithoutComments,
         getCategoryCount,
         getDepartmentCount,
         getNonAnonymousIdeasCount,
         getAnonymousIdeasCount,
         getUserIdeasCount,
         getDepartmentUserCount
        };

import mongoose from 'mongoose';
import User from './userModel.js';

const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    showAllDepartments: {
      type: Boolean,
      default: false,
    },
    fileUrls: [
      {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'fs.files', 
      },
    ],
    agreeToTerms: {
      type: Boolean,
      default: false,
    },
    upVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    downVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        isAnonymous: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);


ideaSchema.pre('save', async function (next) {
  if (this.isNew) {
    const user = await User.findById(this.userId).populate('role');
    if (user && user.role && (user.role.name === 'Admin' || user.role.name === 'QA Manager')) {
      this.showAllDepartments = true;
    }
  }
  next();
});;


const Idea = mongoose.model('Idea', ideaSchema);

export default Idea;

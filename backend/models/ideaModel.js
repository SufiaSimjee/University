import mongoose from "mongoose";

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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    file: [
      {
        fileUrl: { type: String },
        default: Null
      },
    ],
    agreetoterms: {
       type: Boolean,
      default: false,
    },

    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
      },
    ],
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Idea = mongoose.model("Idea", ideaSchema);

export default Idea;

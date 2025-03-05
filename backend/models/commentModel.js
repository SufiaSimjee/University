import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

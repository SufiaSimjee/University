import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  browser: {
    type: String,
    required: true
  },
  deviceType: {
    type: String,
    required: true
  },
  page: {
    type: String,
    required: true
  }, 
}, {
    timestamps: true
});

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

export default UserActivity;

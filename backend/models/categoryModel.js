import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
        unique: true,
      },
      department: { 
         type: mongoose.Schema.Types.ObjectId,
         ref: "Department", 
         required: true 
        }, 
  },
  {
    timestamps: true,
  }
);  

const Category = mongoose.model("Category", categorySchema);

export default Category;
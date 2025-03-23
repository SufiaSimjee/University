import mongoose from "mongoose";

const closureDateSchema = new mongoose.Schema(
  {
    academicYearStart: {
      type: Date,
      required: true, 
    },
    academicYearEnd: {
      type: Date,
      required: true, 
    },
    ideaClosureDate: {
      type: Date,
      required: true, 
    },
    finalClosureDate: {
      type: Date,
      required: true, 
    },
  },
  {
    timestamps: true,
  }
);

const ClosureDate = mongoose.model("ClosureDate", closureDateSchema);

export default ClosureDate;

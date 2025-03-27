import mongoose from "mongoose";

const closureDateSchema = new mongoose.Schema(
  {
    academicYearStart: {
      type: Date,
    
    },
    academicYearEnd: {
      type: Date,
    
    },
    ideaClosureDate: {
      type: Date,
     
    },
    finalClosureDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const ClosureDate = mongoose.model("ClosureDate", closureDateSchema);

export default ClosureDate;

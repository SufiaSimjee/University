import asyncHandler from '../middleware/asyncHandler.js';
import ClosureDate from '../models/ClouserDatesModel.js';

// @desc    Create a new closure date
// @route   POST /api/closuredates
//  @access  Private Admin
// const createClosureDate = asyncHandler(async (req, res) => {
//   const { academicYear, ideaClosureDate, finalClosureDate } = req.body;

//   if (!academicYear || !ideaClosureDate || !finalClosureDate) {
//       res.status(400);
//       throw new Error("All fields are required.");
//   }

//   const academicYearRegex = /^([A-Za-z]+) (\d{4}) - ([A-Za-z]+) (\d{4})$/;
//   const match = academicYear.match(academicYearRegex);

//   if (!match) {
//       res.status(400);
//       throw new Error("Invalid academic year format. Use 'Month 2024 - Month 2025'.");
//   }

//   const startMonth = match[1]; 
//   const startYear = parseInt(match[2]); 
//   const endMonth = match[3]; 
//   const endYear = parseInt(match[4]); 

//   if (startYear === endYear) {
//       res.status(400);
//       throw new Error("Invalid academic year range. Start and end years cannot be the same.");
//   }

//   if (endYear !== startYear + 1) {
//       res.status(400);
//       throw new Error("Invalid academic year range. The end year must be exactly one year after the start year.");
//   }

//   const ideaDate = new Date(ideaClosureDate);
//   const finalDate = new Date(finalClosureDate);

//   const minDate = new Date(`January 1, ${startYear}`);
//   const maxDate = new Date(`December 31, ${endYear}`);

//   if (ideaDate < minDate || ideaDate > maxDate || finalDate < minDate || finalDate > maxDate) {
//       res.status(400);
//       throw new Error("Closure dates must be within the academic year range.");
//   }

//   const existingClosure = await ClosureDate.findOne({ academicYear });
//   if (existingClosure) {
//       res.status(400);
//       throw new Error("Academic year already exists.");
//   }

//   const closureDate = new ClosureDate({
//       academicYear,
//       ideaClosureDate,
//       finalClosureDate,
//   });

//   const savedClosureDate = await closureDate.save();
//   res.status(201).json(savedClosureDate);
// });

const createClosureDate = asyncHandler(async (req, res) => {
  const { academicYearStart, academicYearEnd, ideaClosureDate, finalClosureDate } = req.body;

  // Check for empty or invalid academic years
  if (!academicYearStart || !academicYearEnd || !ideaClosureDate || !finalClosureDate) {
    res.status(400);
    throw new Error("All fields are required.");
  }

  // Validate academic year start and end dates
  const startYear = new Date(academicYearStart).getFullYear();
  const endYear = new Date(academicYearEnd).getFullYear();

  if (startYear === endYear) {
    res.status(400);
    throw new Error("Invalid academic year range. Start and end years cannot be the same.");
  }

  if (endYear !== startYear + 1) {
    res.status(400);
    throw new Error("Invalid academic year range. The end year must be exactly one year after the start year.");
  }

  // Parse and validate closure dates
  const ideaDate = new Date(ideaClosureDate);
  const finalDate = new Date(finalClosureDate);

  // Ensure closure dates are within the academic year range
  const minDate = new Date(academicYearStart);
  const maxDate = new Date(academicYearEnd);
  maxDate.setMonth(11); // December 31st

  if (ideaDate < minDate || ideaDate > maxDate || finalDate < minDate || finalDate > maxDate) {
    res.status(400);
    throw new Error("Closure dates must be within the academic year range.");
  }

  // Check if the academic year already exists in the database
  const existingClosure = await ClosureDate.findOne({ 
    academicYearStart: { $eq: academicYearStart },
    academicYearEnd: { $eq: academicYearEnd }
  });

  if (existingClosure) {
    res.status(400);
    throw new Error("Academic year already exists.");
  }

  // Create new closure date document
  const closureDate = new ClosureDate({
    academicYearStart,
    academicYearEnd,
    ideaClosureDate,
    finalClosureDate,
  });

  const savedClosureDate = await closureDate.save();
  res.status(201).json(savedClosureDate);
});


// @desc    Get all closure dates
// @route   GET /api/closuredates
// @access  Private Admin
const getClosureDates = async (req, res) => {
    const closureDates = await ClosureDate.find()
                                          .sort({ createdAt: -1 })
                                         
    res.status(200).json(closureDates);
   
    if (!closureDates || closureDates.length === 0) {
      res.status(404);
      throw new Error("No closure dates found.");
    }
};

// @desc    Get all closure dates
// @route   GET /api/closuredates/latest
// @access  Private Admin
const getLatestClosureDates = async (req, res) => {
  try {
    const firstClosureDate = await ClosureDate.findOne().sort({ createdAt: - 1 });

    if (!firstClosureDate) {
      return res.status(404).json({ message: "No closure date found" });
    }

    res.status(200).json(firstClosureDate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a closure date
// @route   PUT /api/closuredates/:id
// @access  Private Admin
// const updateClosureDate = asyncHandler(async (req, res) => {
//   const { id } = req.params; 
//   const { academicYear, ideaClosureDate, finalClosureDate } = req.body;

//   if (!ideaClosureDate && !finalClosureDate && !academicYear) {
//     res.status(400);
//     throw new Error("At least one field (academicYear, ideaClosureDate, or finalClosureDate) is required.");
//   }

//   const closureDate = await ClosureDate.findById(id);

//   if (!closureDate) {
//     res.status(404);
//     throw new Error("Closure date not found.");
//   }

//   if (academicYear) {
//     const academicYearRegex = /^([A-Za-z]+) (\d{4}) - ([A-Za-z]+) (\d{4})$/;
//     const match = academicYear.match(academicYearRegex);

//     if (!match) {
//       res.status(400);
//       throw new Error("Invalid academic year format. Use 'Month 2024 - Month 2025'.");
//     }

//     const startMonth = match[1];
//     const startYear = parseInt(match[2]);
//     const endMonth = match[3];
//     const endYear = parseInt(match[4]);

//     if (startYear === endYear) {
//       res.status(400);
//       throw new Error("Invalid academic year range. Start and end years cannot be the same.");
//     }

//     if (endYear !== startYear + 1) {
//       res.status(400);
//       throw new Error("Invalid academic year range. The end year must be exactly one year after the start year.");
//     }

//     const existingClosure = await ClosureDate.findOne({ academicYear });
//     if (existingClosure && existingClosure._id.toString() !== id) {
//       res.status(400);
//       throw new Error("Academic year already exists.");
//     }

//     closureDate.academicYear = academicYear; 
//   }

//   if (ideaClosureDate || finalClosureDate) {
//     const startYear = new Date(closureDate.academicYear.split(" - ")[0].split(" ")[1]);
//     const endYear = new Date(closureDate.academicYear.split(" - ")[1].split(" ")[1]);

//     const minDate = new Date(`January 1, ${startYear.getFullYear()}`);
//     const maxDate = new Date(`December 31, ${endYear.getFullYear()}`);

//     if (ideaClosureDate) {
//       const ideaDate = new Date(ideaClosureDate);
//       if (ideaDate < minDate || ideaDate > maxDate) {
//         res.status(400);
//         throw new Error("Idea closure date must be within the academic year range.");
//       }
//       closureDate.ideaClosureDate = ideaClosureDate; 
//     }

//     if (finalClosureDate) {
//       const finalDate = new Date(finalClosureDate);
//       if (finalDate < minDate || finalDate > maxDate) {
//         res.status(400);
//         throw new Error("Final closure date must be within the academic year range.");
//       }
//       closureDate.finalClosureDate = finalClosureDate; 
//     }
//   }

//   const updatedClosureDate = await closureDate.save();
  
//   res.status(200).json(updatedClosureDate);
// });

const updateClosureDate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { academicYearStart, academicYearEnd, ideaClosureDate, finalClosureDate } = req.body;

  // Ensure that at least one field is provided
  if (!ideaClosureDate && !finalClosureDate && !academicYearStart && !academicYearEnd) {
    res.status(400);
    throw new Error("At least one field (academicYearStart, academicYearEnd, ideaClosureDate, or finalClosureDate) is required.");
  }

  const closureDate = await ClosureDate.findById(id);

  if (!closureDate) {
    res.status(404);
    throw new Error("Closure date not found.");
  }

  // Handle academic year start and end date changes
  if (academicYearStart || academicYearEnd) {
    if (academicYearStart) {
      const newStartYear = new Date(academicYearStart).getFullYear();
      const newEndYear = new Date(academicYearEnd).getFullYear();

      // Check if the academic year is valid
      if (newStartYear === newEndYear) {
        res.status(400);
        throw new Error("Invalid academic year range. Start and end years cannot be the same.");
      }

      if (newEndYear !== newStartYear + 1) {
        res.status(400);
        throw new Error("Invalid academic year range. The end year must be exactly one year after the start year.");
      }

      closureDate.academicYearStart = academicYearStart;
    }

    if (academicYearEnd) {
      closureDate.academicYearEnd = academicYearEnd;
    }
  }

  // Handle closure date updates (ideaClosureDate, finalClosureDate)
  if (ideaClosureDate || finalClosureDate) {
    const startYear = new Date(closureDate.academicYearStart).getFullYear();
    const endYear = new Date(closureDate.academicYearEnd).getFullYear();

    const minDate = new Date(`${startYear}-01-01`);
    const maxDate = new Date(`${endYear}-12-31`);

    if (ideaClosureDate) {
      const ideaDate = new Date(ideaClosureDate);
      if (ideaDate < minDate || ideaDate > maxDate) {
        res.status(400);
        throw new Error("Idea closure date must be within the academic year range.");
      }
      closureDate.ideaClosureDate = ideaClosureDate;
    }

    if (finalClosureDate) {
      const finalDate = new Date(finalClosureDate);
      if (finalDate < minDate || finalDate > maxDate) {
        res.status(400);
        throw new Error("Final closure date must be within the academic year range.");
      }
      closureDate.finalClosureDate = finalClosureDate;
    }
  }

  // Save the updated closure date document
  const updatedClosureDate = await closureDate.save();

  res.status(200).json(updatedClosureDate);
});


// @desc    Delete a closure date
// @route   DELETE /api/closuredates/:id
// @access  Private Admin
const deleteClosureDate = asyncHandler(async (req, res) => {
  const { id } = req.params;  

  const closureDate = await ClosureDate.findById(id);

  if (!closureDate) {
    res.status(404);
    throw new Error("Closure date not found.");
  }

  await closureDate.remove();

  res.status(200).json({ message: "Closure date successfully deleted." });
});

export { createClosureDate,
         getLatestClosureDates,
         updateClosureDate,
         deleteClosureDate ,
         getClosureDates
 };
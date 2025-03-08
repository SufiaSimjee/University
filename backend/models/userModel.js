import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 8,  
        maxlength: 12, 
        match: [
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/, 
          "Password must be between 8 to 12 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        ],
      },
      // role: {
      //   type: String,
      //   enum: ['Staff', 'QA Manager', 'QA Coordinator', 'Admin'],
      //   default: 'Staff'
      // },

      role: 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Role', 
         
        },
      
      departments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Department', 
        },
      ],
      isActive: {
        type: Boolean,
        default: true
      } 
     },
      {
          timestamps: true,
      }
);

// to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// to hash password
userSchema.pre('save' ,async function (next) {

    /// if password is not modified then move to next
    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userSchema);

export default User;

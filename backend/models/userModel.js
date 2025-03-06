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
        required: true
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

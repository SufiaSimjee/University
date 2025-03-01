import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";
import users from "./data/users.js";
import User from "./models/userModel.js";
import departments from "./data/departments.js";
import Department from "./models/departmentModel.js";
import connectDB from "./config/db.js";

dotenv.config();

// Connect to the database
connectDB();

const importData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Department.deleteMany();

        // insert departments
        const createdDepartments = await Department.insertMany(departments);
        console.log(`Departments Imported!`.green.inverse);

       // insert users
        const createdUsers = await User.insertMany(users);

       // assign departments to users
        const staffUsers = createdUsers.filter(user => user.role === 'Staff');
        staffUsers.forEach((user, index) => {
            user.departments = [createdDepartments[index % createdDepartments.length]._id]; 
        });

       // save 
        await Promise.all(staffUsers.map(user => user.save()));
        console.log(`Staff Users Assigned to Departments!`.green.inverse);

        console.log("Data Imported!".green.inverse);
        process.exit();
    } catch (error) {
        console.log(`Error: ${error.message}`.red.inverse);
        process.exit(1);
    }
};

// Function to destroy data from the database
const destroyData = async () => {
    try {
        await User.deleteMany();
        await Department.deleteMany();


        console.log("Data Destroyed!".red.inverse);
        process.exit();
    } catch (error) {
        console.log(`Error: ${error.message}`.red.inverse);
        process.exit(1);
    }
};

// Run the appropriate function based on the argument
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}

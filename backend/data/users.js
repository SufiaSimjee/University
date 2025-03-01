import bcrypt from 'bcryptjs';

const users = [
    {
      fullName: "Alice Johnson",
      email: "alice@gmail.com",
      password: bcrypt.hashSync('123456' , 10) ,
      role: "Staff",
      departments: [], 
      isActive: true
    },
    {
      fullName: "Bob Smith",
      email: "bob@gmail.com",
      password: bcrypt.hashSync('123456' , 10) ,
      role: "QA Manager",
      departments: [],
      isActive: true
    },
    {
      fullName: "Charlie Brown",
      email: "charlie@gmail.com",
      password: bcrypt.hashSync('123456' , 10) ,
      role: "QA Coordinator",
      departments: [],
      isActive: true
    },
    {
      fullName: "David Williams",
      email: "david@gmail.com",
      password: bcrypt.hashSync('123456' , 10) ,
      role: "Admin",
      departments: [],
      isActive: true
    },
    {
      fullName: "Eva Green",
      email: "Eva@gmail.com",
      password: bcrypt.hashSync('123456' , 10) ,
      role: "Staff",
      departments: [], 
      isActive: true
    }
  ];
  
  export default users;
  
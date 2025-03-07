import jwt from 'jsonwebtoken';



const generateToken = (res , userId) => {
    // generate token
    const token = jwt.sign({userId} , process.env.JWT_SECRET, {
        expiresIn :'30d'
      });

      // Log the generated token (or a success message)
      console.log('JWT Generated:', token);

      // set jwt as httpOnly cookie
      res.cookie('jwt' , token, {
         httpOnly : true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
         
          maxAge : 30 * 24 * 60 * 60 * 1000
      });
 };

export default generateToken
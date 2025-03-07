import jwt from 'jsonwebtoken';

const generateToken = (res , userId) => {
    // generate token
    const token = generateToken(userId);

      // set jwt as httpOnly cookie
      res.cookie('jwt' , token, {
         httpOnly : true,
          secure : true,
          sameSite : 'none',
        //   maxAge : 30 * 24 * 60 * 60 * 1000
      });
 };

export default generateToken;
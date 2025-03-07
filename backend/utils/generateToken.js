import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  console.log('JWT Generated:', token);

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
    domain: process.env.NODE_ENV === 'production' ? 'university-red.vercel.app' : 'localhost',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
};

export default generateToken;

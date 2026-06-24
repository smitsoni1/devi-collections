import jwt from 'jsonwebtoken';

/**
 * Generate a JWT and set it as an HTTP-only cookie on the response.
 * @param {Object} res - Express response object
 * @param {string} userId - MongoDB user _id
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('token', token, {
    httpOnly: true,                                          // XSS protection
    secure: process.env.NODE_ENV === 'production',          // HTTPS only in prod
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,                      // 30 days in ms
  });
};

export default generateToken;

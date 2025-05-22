const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if no token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('No token, authorization denied');
    error.statusCode = 401;
    return next(error);
  }

  try {
    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    const error = new Error('Token is not valid');
    error.statusCode = 401;
    next(error);
  }
};

module.exports = auth;

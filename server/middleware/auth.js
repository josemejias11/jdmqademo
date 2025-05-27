const jwt = require('jsonwebtoken');

// Maximum token length to prevent 431 errors (8KB is a conservative limit)
const MAX_TOKEN_LENGTH = 8192;

const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if no token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth Error: No token or not properly formatted');
    const error = new Error('No token, authorization denied');
    error.statusCode = 401;
    return next(error);
  }

  try {
    // Verify token
    const token = authHeader.split(' ')[1];

    // Check if token is too large
    if (token && token.length > MAX_TOKEN_LENGTH) {
      console.log(
        `Auth Error: Token too large (${token.length} bytes) - Exceeds limit of ${MAX_TOKEN_LENGTH} bytes`
      );
      const error = new Error('Token is too large');
      error.statusCode = 431;
      return next(error);
    }

    console.log(`Auth: Token received (length: ${token.length} bytes)`);

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    console.log(`Auth: Token verified successfully for user: ${decoded.username}`);

    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    console.log(`Auth Error: ${err.message}`);
    const error = new Error('Token is not valid');
    error.statusCode = 401;
    next(error);
  }
};

module.exports = auth;

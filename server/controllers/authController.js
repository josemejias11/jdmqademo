const jwt = require('jsonwebtoken');

// Mock user (in a real app, this would come from a database)
const mockUser = {
  username: 'admin',
  password: 'password123'
};

// Login user
const login = (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check credentials
    if (username === mockUser.username && password === mockUser.password) {
      // Create JWT token
      const token = jwt.sign(
        { username }, 
        process.env.JWT_SECRET || 'your_secret_key', 
        { expiresIn: '1h' }
      );
      
      return res.json({ success: true, token });
    }

    // Invalid credentials
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    return next(error);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login
};
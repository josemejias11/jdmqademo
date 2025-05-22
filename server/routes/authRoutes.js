const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/login - Login user
router.post(
  '/login',
  [
    body('username')
      .notEmpty()
      .withMessage('Username is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  validate,
  authController.login
);

module.exports = router;
import express from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// POST /api/auth/login - Login user
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  authController.login
);

export default router; 
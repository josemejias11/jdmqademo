import express from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate';
import taskController from '../controllers/taskController';
import auth from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all task routes
router.use(auth as express.RequestHandler);

// Validation rules
const taskValidationRules = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters'),
  body('completed').optional().isBoolean().withMessage('Completed must be a boolean')
];

// Routes
router.get('/', taskController.getTasks as unknown as express.RequestHandler);
router.get('/:id', taskController.getTaskById as unknown as express.RequestHandler);
router.post('/', taskValidationRules, validate, taskController.createTask as unknown as express.RequestHandler);
router.put('/:id', taskValidationRules, validate, taskController.updateTask as unknown as express.RequestHandler);
router.delete('/:id', taskController.deleteTask as unknown as express.RequestHandler);

export default router; 
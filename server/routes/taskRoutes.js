const express = require('express');
const { body, param } = require('express-validator');
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All task routes require authentication
router.use(auth);

// GET /api/tasks - Get all tasks
router.get('/', taskController.getTasks);

// GET /api/tasks/:id - Get a single task
router.get(
  '/:id',
  [param('id').isInt().withMessage('Task ID must be an integer')],
  validate,
  taskController.getTaskById
);

// POST /api/tasks - Create a new task
router.post(
  '/',
  [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isString()
      .withMessage('Title must be a string')
      .isLength({ max: 100 })
      .withMessage('Title cannot exceed 100 characters'),
    body('description').optional().isString().withMessage('Description must be a string')
  ],
  validate,
  taskController.createTask
);

// PUT /api/tasks/:id - Update a task
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Task ID must be an integer'),
    body('title')
      .optional()
      .isString()
      .withMessage('Title must be a string')
      .isLength({ max: 100 })
      .withMessage('Title cannot exceed 100 characters'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('completed').optional().isBoolean().withMessage('Completed must be a boolean')
  ],
  validate,
  taskController.updateTask
);

// DELETE /api/tasks/:id - Delete a task
router.delete(
  '/:id',
  [param('id').isInt().withMessage('Task ID must be an integer')],
  validate,
  taskController.deleteTask
);

module.exports = router;

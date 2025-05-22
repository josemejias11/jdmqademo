const Task = require('../models/Task');

// Get all tasks for the authenticated user
const getTasks = (req, res, next) => {
  try {
    const tasks = Task.findByUserId(req.user.username);
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

// Get a single task by ID
const getTaskById = (req, res, next) => {
  try {
    const task = Task.findById(req.params.id, req.user.username);

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      return next(error);
    }

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// Create a new task
const createTask = (req, res, next) => {
  try {
    const { title, description } = req.body;
    const task = Task.create({
      title,
      description,
      userId: req.user.username
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// Update a task
const updateTask = (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const task = Task.update(req.params.id, req.user.username, {
      title,
      description,
      completed
    });

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      return next(error);
    }

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// Delete a task
const deleteTask = (req, res, next) => {
  try {
    const deleted = Task.delete(req.params.id, req.user.username);

    if (!deleted) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      return next(error);
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};

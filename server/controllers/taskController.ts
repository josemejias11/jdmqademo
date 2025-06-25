import { Request, Response, NextFunction } from 'express';
import Task from '../models/Task.js';

interface TaskRequestBody {
  title: string;
  description?: string;
  completed?: boolean;
}

interface TaskParams {
  id: string;
}

interface AuthenticatedUser {
  username: string;
}

type AuthenticatedRequest<
  P = Record<string, never>,
  ResBody = unknown,
  ReqBody = unknown
> = Request<P, ResBody, ReqBody> & {
  user: AuthenticatedUser;
};

// Get all tasks for the authenticated user
const getTasks = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = Task.findByUserId(req.user.username);
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

// Get a single task by ID
const getTaskById = (req: AuthenticatedRequest<TaskParams>, res: Response, next: NextFunction) => {
  try {
    const task = Task.findById(req.params.id, req.user.username);

    if (!task) {
      const error = new Error('Task not found');
      (error as any).statusCode = 404;
      return next(error);
    }

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// Create a new task
const createTask = (
  req: AuthenticatedRequest<Record<string, never>, unknown, TaskRequestBody>,
  res: Response,
  next: NextFunction
) => {
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
const updateTask = (
  req: AuthenticatedRequest<TaskParams, unknown, TaskRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, completed } = req.body;
    const task = Task.update(req.params.id, req.user.username, {
      title,
      description,
      completed
    });

    if (!task) {
      const error = new Error('Task not found');
      (error as any).statusCode = 404;
      return next(error);
    }

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// Delete a task
const deleteTask = (req: AuthenticatedRequest<TaskParams>, res: Response, next: NextFunction) => {
  try {
    const deleted = Task.delete(req.params.id, req.user.username);

    if (!deleted) {
      const error = new Error('Task not found');
      (error as any).statusCode = 404;
      return next(error);
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};

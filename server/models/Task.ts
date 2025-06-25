/**
 * Simple in-memory Task model for demonstration purposes
 * In a real application, this would interact with a database
 */

interface TaskData {
  title: string;
  description?: string;
  userId: string;
}

interface Task extends TaskData {
  id: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

// In-memory store for tasks
const tasks: Task[] = [];
let nextId = 1;

class TaskModel {
  /**
   * Find all tasks for a specific user
   * @param userId - The user ID
   * @returns Array of tasks
   */
  static findByUserId(userId: string): Task[] {
    return tasks.filter(task => task.userId === userId);
  }

  /**
   * Find a task by ID
   * @param id - The task ID
   * @param userId - The user ID (for authorization)
   * @returns The task or null if not found
   */
  static findById(id: string, userId: string): Task | null {
    return tasks.find(task => task.id === id && task.userId === userId) || null;
  }

  /**
   * Create a new task
   * @param taskData - The task data
   * @returns The created task
   */
  static create(taskData: TaskData): Task {
    const task: Task = {
      id: String(nextId++),
      title: taskData.title,
      description: taskData.description || '',
      completed: false,
      userId: taskData.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    tasks.push(task);
    return task;
  }

  /**
   * Update a task
   * @param id - The task ID
   * @param userId - The user ID (for authorization)
   * @param updates - The updates to apply
   * @returns The updated task or null if not found
   */
  static update(id: string, userId: string, updates: TaskUpdate): Task | null {
    const taskIndex = tasks.findIndex(task => task.id === id && task.userId === userId);

    if (taskIndex === -1) {
      return null;
    }

    const task = tasks[taskIndex];
    const updatedTask: Task = {
      ...task,
      title: updates.title !== undefined ? updates.title : task.title,
      description: updates.description !== undefined ? updates.description : task.description,
      completed: updates.completed !== undefined ? updates.completed : task.completed,
      updatedAt: new Date()
    };

    tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  /**
   * Delete a task
   * @param id - The task ID
   * @param userId - The user ID (for authorization)
   * @returns True if deleted, false if not found
   */
  static delete(id: string, userId: string): boolean {
    const taskIndex = tasks.findIndex(task => task.id === id && task.userId === userId);

    if (taskIndex === -1) {
      return false;
    }

    tasks.splice(taskIndex, 1);
    return true;
  }
}

export default TaskModel;

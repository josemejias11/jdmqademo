/**
 * Simple in-memory Task model for demonstration purposes
 * In a real application, this would interact with a database
 */

// In-memory store for tasks
const tasks = [];
let nextId = 1;

class Task {
  /**
   * Find all tasks for a specific user
   * @param {string} userId - The user ID
   * @returns {Array} - Array of tasks
   */
  static findByUserId(userId) {
    return tasks.filter(task => task.userId === userId);
  }

  /**
   * Find a task by ID
   * @param {string} id - The task ID
   * @param {string} userId - The user ID (for authorization)
   * @returns {Object|null} - The task or null if not found
   */
  static findById(id, userId) {
    return tasks.find(task => task.id === id && task.userId === userId) || null;
  }

  /**
   * Create a new task
   * @param {Object} taskData - The task data
   * @returns {Object} - The created task
   */
  static create(taskData) {
    const task = {
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
   * @param {string} id - The task ID
   * @param {string} userId - The user ID (for authorization)
   * @param {Object} updates - The updates to apply
   * @returns {Object|null} - The updated task or null if not found
   */
  static update(id, userId, updates) {
    const taskIndex = tasks.findIndex(task => task.id === id && task.userId === userId);

    if (taskIndex === -1) {
      return null;
    }

    const task = tasks[taskIndex];
    const updatedTask = {
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
   * @param {string} id - The task ID
   * @param {string} userId - The user ID (for authorization)
   * @returns {boolean} - True if deleted, false if not found
   */
  static delete(id, userId) {
    const taskIndex = tasks.findIndex(task => task.id === id && task.userId === userId);

    if (taskIndex === -1) {
      return false;
    }

    tasks.splice(taskIndex, 1);
    return true;
  }
}

module.exports = Task;

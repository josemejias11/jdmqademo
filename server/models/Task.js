// In-memory task store (in a real app, this would be a database)
let tasks = [];
let nextId = 1;

class Task {
  constructor(id, title, description, completed, userId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.userId = userId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Find all tasks for a user
  static findByUserId(userId) {
    return tasks.filter(task => task.userId === userId);
  }

  // Find a task by ID for a specific user
  static findById(id, userId) {
    return tasks.find(task => task.id === parseInt(id) && task.userId === userId);
  }

  // Create a new task
  static create(data) {
    const { title, description, userId } = data;
    const task = new Task(nextId++, title, description, false, userId);
    tasks.push(task);
    return task;
  }

  // Update a task
  static update(id, userId, data) {
    const index = tasks.findIndex(task => task.id === parseInt(id) && task.userId === userId);
    if (index === -1) return null;

    const task = tasks[index];
    const updatedTask = {
      ...task,
      ...data,
      id: task.id, // Ensure ID doesn't change
      userId: task.userId, // Ensure userId doesn't change
      updatedAt: new Date()
    };

    tasks[index] = updatedTask;
    return updatedTask;
  }

  // Delete a task
  static delete(id, userId) {
    const index = tasks.findIndex(task => task.id === parseInt(id) && task.userId === userId);
    if (index === -1) return false;

    tasks.splice(index, 1);
    return true;
  }

  // Clear all tasks (for testing)
  static clear() {
    tasks = [];
    nextId = 1;
  }
}

module.exports = Task;
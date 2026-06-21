interface TaskData {
  title: string;
  description?: string;
  userId: string;
}

export interface Task extends TaskData {
  id: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

const defaultTasks: Task[] = [];
const sessionsTasks = new Map<string, Task[]>();
let nextId = 1;

export class SessionTaskStore {
  private static getSessionTasks(sessionId: string): Task[] {
    if (!sessionsTasks.has(sessionId)) {
      sessionsTasks.set(sessionId, JSON.parse(JSON.stringify(defaultTasks)));
    }
    return sessionsTasks.get(sessionId)!;
  }

  /**
   * Find all tasks in a session for a specific user
   */
  static findByUserId(sessionId: string, userId: string): Task[] {
    const tasks = this.getSessionTasks(sessionId);
    return tasks.filter(task => task.userId === userId);
  }

  /**
   * Find a specific task by ID in a session
   */
  static findById(sessionId: string, id: string, userId: string): Task | null {
    const tasks = this.getSessionTasks(sessionId);
    return tasks.find(task => task.id === id && task.userId === userId) || null;
  }

  /**
   * Create a task inside a session
   */
  static create(sessionId: string, taskData: TaskData): Task {
    const tasks = this.getSessionTasks(sessionId);
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
   * Update a task in a session
   */
  static update(sessionId: string, id: string, userId: string, updates: TaskUpdate): Task | null {
    const tasks = this.getSessionTasks(sessionId);
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
   * Delete a task from a session
   */
  static delete(sessionId: string, id: string, userId: string): boolean {
    const tasks = this.getSessionTasks(sessionId);
    const taskIndex = tasks.findIndex(task => task.id === id && task.userId === userId);
    if (taskIndex === -1) {
      return false;
    }
    tasks.splice(taskIndex, 1);
    return true;
  }
}

import React, { createContext, useState, useEffect } from 'react';
import { Task } from '../types';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  TaskFormValues
} from '../services/taskService';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  task: string;
  setTask: (task: string) => void;
  handleAddTask: (e: React.FormEvent<HTMLFormElement>) => void;
  addTaskObject: (taskData: TaskFormValues) => Promise<void>;
  toggleTaskDone: (id: string) => void;
  deleteTask: (id: string) => void;
  loading: boolean;
  error: string | null;
}

// Create the context
export const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: React.ReactNode;
}

// Provider component
const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();

  // Load tasks from API on initial load and when auth changes
  useEffect(() => {
    if (!authState.isAuthenticated) {
      setTasks([]);
      return;
    }
    const fetchTasks = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await getTasks();
        setTasks(response.data);
      } catch (err) {
        const apiError = err as { message?: string };
        setError(apiError.message || 'Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    void fetchTasks();
  }, [authState.isAuthenticated]);

  // Add a new task via API
  const addTask = async (text: string): Promise<void> => {
    if (text.trim() === '') return;
    setLoading(true);
    setError(null);
    try {
      const response = await createTask({ title: text.trim(), description: '', completed: false });
      setTasks([...tasks, response.data]);
    } catch (err) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Failed to add task. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new task via API with full task object
  const addTaskObject = async (taskData: TaskFormValues): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await createTask(taskData);
      setTasks([...tasks, response.data]);
    } catch (err) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Failed to add task. Please try again later.');
      throw err; // Re-throw so the form can handle the error
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const handleAddTask = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void addTask(task);
    setTask('');
  };

  // Toggle the 'done' status of a task via API
  const toggleTaskDone = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const taskToToggle = tasks.find(t => t.id === id);
      if (!taskToToggle) {
        setError('Task not found');
        return;
      }
      const response = await updateTask(id, {
        title: taskToToggle.title,
        description: taskToToggle.description,
        completed: !taskToToggle.completed
      });
      setTasks(tasks.map(t => (t.id === id ? response.data : t)));
    } catch (err) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Failed to update task. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a task via API
  const removeTask = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Failed to delete task. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Values and functions to expose via the context
  const value = {
    tasks,
    task,
    setTask,
    handleAddTask,
    addTaskObject,
    toggleTaskDone,
    deleteTask: removeTask,
    loading,
    error
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export default TaskProvider;

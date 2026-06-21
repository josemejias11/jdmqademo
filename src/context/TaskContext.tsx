import React, { createContext, useState, useEffect } from 'react';
import { Task } from '../types';
import {
  getTasks as apiGetTasks,
  getTaskById as apiGetTaskById,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  TaskFormValues
} from '../services/taskService';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  createTask: (taskData: TaskFormValues) => Promise<Task>;
  getTaskById: (id: string) => Promise<Task>;
  updateTask: (id: string, taskData: TaskFormValues) => Promise<Task>;
  toggleTaskDone: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
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
        const response = await apiGetTasks();
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

  // Fetch a task by ID (loads from API and updates/adds to cache)
  const getTaskById = async (id: string): Promise<Task> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGetTaskById(id);
      const fetchedTask = response.data;
      setTasks(prevTasks => {
        const exists = prevTasks.some(t => t.id === id);
        if (exists) {
          return prevTasks.map(t => (t.id === id ? fetchedTask : t));
        } else {
          return [...prevTasks, fetchedTask];
        }
      });
      return fetchedTask;
    } catch (err) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Failed to load task. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData: TaskFormValues): Promise<Task> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCreateTask(taskData);
      const newTask = response.data;
      setTasks(prevTasks => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Failed to add task. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing task
  const updateTask = async (id: string, taskData: TaskFormValues): Promise<Task> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUpdateTask(id, taskData);
      const updatedTask = response.data;
      setTasks(prevTasks => prevTasks.map(t => (t.id === id ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Failed to update task. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle the 'done' status of a task
  const toggleTaskDone = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const taskToToggle = tasks.find(t => t.id === id);
      if (!taskToToggle) {
        throw new Error('Task not found');
      }
      const response = await apiUpdateTask(id, {
        title: taskToToggle.title,
        description: taskToToggle.description,
        completed: !taskToToggle.completed
      });
      setTasks(prevTasks => prevTasks.map(t => (t.id === id ? response.data : t)));
    } catch (err) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Failed to update task. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const removeTask = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await apiDeleteTask(id);
      setTasks(prevTasks => prevTasks.filter(t => t.id !== id));
    } catch (err) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Failed to delete task. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Values and functions to expose via the context
  const value = {
    tasks,
    createTask,
    getTaskById,
    updateTask,
    toggleTaskDone,
    deleteTask: removeTask,
    loading,
    error
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export default TaskProvider;

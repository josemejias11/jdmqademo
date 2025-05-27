import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { Task, ApiError } from '../types';
import { getAuthConfig } from '../utils/authUtils';

const API_URL = '/api/tasks';

interface TaskContextType {
  tasks: Task[];
  task: string;
  setTask: (task: string) => void;
  handleAddTask: (e: React.FormEvent<HTMLFormElement>) => void;
  toggleTaskDone: (id: number) => void;
  deleteTask: (id: number) => void;
  loading: boolean;
  error: string | null;
}

// Create the context
export const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Custom hook to use the context
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: React.ReactNode;
}

// Provider component
export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Use the getAuthConfig from authUtils
  const getConfig = useCallback(() => {
    return getAuthConfig();
  }, []);

  // Load tasks from API on initial load
  useEffect(() => {
    const fetchTasks = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(API_URL, getConfig());
        setTasks(response.data);
      } catch (err) {
        const apiError = err as ApiError;
        console.error('Error fetching tasks:', apiError);

        // Special handling for 431 errors (Request Header Fields Too Large)
        if (apiError.response?.status === 431) {
          // This could be caused by a token that's too large
          setError('Session expired or invalid. Please log out and log in again.');
        } else {
          setError(
            apiError.response?.data?.message || 'Failed to load tasks. Please try again later.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchTasks();
  }, [getConfig]);

  // Add a new task via API
  const addTask = async (text: string): Promise<void> => {
    if (text.trim() === '') return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(
        API_URL,
        { title: text.trim(), description: '' },
        getConfig()
      );

      setTasks([...tasks, response.data]);
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Error adding task:', apiError);
      setError(apiError.response?.data?.message || 'Failed to add task. Please try again later.');
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
  const toggleTaskDone = async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Find the task to toggle
      const taskToToggle = tasks.find(t => t.id === id);
      if (!taskToToggle) {
        console.error('Task not found');
        setError('Task not found');
        return;
      }

      // Update the task via API
      const response = await apiClient.put(
        `${API_URL}/${id}`,
        { completed: !taskToToggle.completed },
        getConfig()
      );

      // Update local state
      setTasks(tasks.map(t => (t.id === id ? response.data : t)));
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Error toggling task:', apiError);
      setError(
        apiError.response?.data?.message || 'Failed to update task. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete a task via API
  const deleteTask = async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.delete(`${API_URL}/${id}`, getConfig());
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Error deleting task:', apiError);
      setError(
        apiError.response?.data?.message || 'Failed to delete task. Please try again later.'
      );
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
    toggleTaskDone,
    deleteTask,
    loading,
    error
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

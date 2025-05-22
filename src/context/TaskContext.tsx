import React, { createContext, useContext, useState, useEffect } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Task, BackendTask, ApiError, AxiosAuthConfig } from '../types';

const API_URL = 'http://localhost:5000/api/tasks';

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

  // Get the auth token for API requests
  const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
  };

  // Configure axios with auth token
  const getAxiosConfig = (): AxiosAuthConfig => {
    const token = getAuthToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Map backend task to frontend task
  const mapBackendTask = (backendTask: BackendTask): Task => {
    return {
      id: backendTask.id,
      text: backendTask.title,
      done: backendTask.completed
    };
  };

  // Load tasks from API on initial load
  useEffect(() => {
    const fetchTasks = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response: AxiosResponse<BackendTask[]> = await axios.get(API_URL, getAxiosConfig());
        const backendTasks = response.data;
        const frontendTasks = backendTasks.map(mapBackendTask);
        setTasks(frontendTasks);
      } catch (err) {
        const apiError = err as ApiError;
        console.error('Error fetching tasks:', apiError);
        setError(apiError.response?.data?.message || 'Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Add a new task via API
  const addTask = async (text: string): Promise<void> => {
    if (text.trim() === '') return;

    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<BackendTask> = await axios.post(
        API_URL, 
        { title: text.trim(), description: '' }, 
        getAxiosConfig()
      );

      const newTask = mapBackendTask(response.data);
      setTasks([...tasks, newTask]);
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
    addTask(task);
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
        throw new Error('Task not found');
      }

      // Update the task via API
      const response: AxiosResponse<BackendTask> = await axios.put(
        `${API_URL}/${id}`, 
        { completed: !taskToToggle.done }, 
        getAxiosConfig()
      );

      // Update local state
      const updatedTask = mapBackendTask(response.data);
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Error toggling task:', apiError);
      setError(apiError.response?.data?.message || 'Failed to update task. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a task via API
  const deleteTask = async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete<void>(`${API_URL}/${id}`, getAxiosConfig());
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Error deleting task:', apiError);
      setError(apiError.response?.data?.message || 'Failed to delete task. Please try again later.');
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

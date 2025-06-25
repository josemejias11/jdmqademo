import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { getAuthConfig } from '../utils/authUtils';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';


const API_URL = '/tasks';

interface TaskContextType {
  tasks: Task[];
  task: string;
  setTask: (task: string) => void;
  handleAddTask: (e: React.FormEvent<HTMLFormElement>) => void;
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
  }, []);

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
      const response = await updateTask(id, { completed: !taskToToggle.completed });
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
    toggleTaskDone,
    deleteTask: removeTask,
    loading,
    error
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export default TaskProvider;

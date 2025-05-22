import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '../types';

const STORAGE_KEY = 'taskManager.tasks';

interface TaskContextType {
  tasks: Task[];
  task: string;
  setTask: (task: string) => void;
  handleAddTask: (e: React.FormEvent<HTMLFormElement>) => void;
  toggleTaskDone: (index: number) => void;
  deleteTask: (index: number) => void;
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

  const loadStoredTasks = () => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  };

  // Load tasks from localStorage on initial load
  useEffect(() => {
    setTasks(loadStoredTasks());
  }, []);

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string): void => {
    if (text.trim() === '') return;
    setTasks([...tasks, { text: text.trim(), done: false }]);
  };

  // Add a new task
  const handleAddTask = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    addTask(task);
    setTask('');
  };

  // Toggle the 'done' status of a task
  const toggleTaskDone = (index: number): void => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  // Delete a task
  const deleteTask = (index: number): void => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Values and functions to expose via the context
  const value = {
    tasks,
    task,
    setTask,
    handleAddTask,
    toggleTaskDone,
    deleteTask
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

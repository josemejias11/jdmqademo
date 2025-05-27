// Task utility functions
import { Task } from '../types';

/**
 * Maps a backend task object to the frontend Task type
 * @param backendTask The task object from the backend API
 * @returns A Task object formatted for the frontend
 * @deprecated This function is no longer needed as the frontend Task model now matches the backend model
 */
export const mapBackendTask = (backendTask: Task): Task => ({
  id: backendTask.id,
  title: backendTask.title,
  completed: backendTask.completed,
  description: backendTask.description,
  createdAt: backendTask.createdAt,
  updatedAt: backendTask.updatedAt
});

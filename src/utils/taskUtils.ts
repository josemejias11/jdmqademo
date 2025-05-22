// Task utility functions
import { Task, BackendTask } from '../types';

/**
 * Maps a backend task object to the frontend Task type
 * @param backendTask The task object from the backend API
 * @returns A Task object formatted for the frontend
 */
export const mapBackendTask = (backendTask: BackendTask): Task => ({
  id: backendTask.id,
  text: backendTask.title,
  done: backendTask.completed
});

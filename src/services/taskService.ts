// Task service functions
import axios, { AxiosResponse } from 'axios';
import { Task, BackendTask, ApiError, AxiosAuthConfig } from '../types';
import { getAuthConfig } from '../utils/authUtils';
import { mapBackendTask } from '../utils/taskUtils';

const API_URL = 'http://localhost:5000/api/tasks';

/**
 * Fetch all tasks from the API
 * @returns Array of Task objects
 * @throws ApiError if fetching fails
 */
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response: AxiosResponse<BackendTask[]> = await axios.get(API_URL, getAuthConfig());
    const backendTasks = response.data;
    return backendTasks.map(mapBackendTask);
  } catch (err) {
    const apiError = err as ApiError;
    console.error('Error fetching tasks:', apiError);
    throw apiError;
  }
};

/**
 * Add a new task via API
 * @param text The task text
 * @returns The newly created Task
 * @throws ApiError if adding fails
 */
export const addTask = async (text: string): Promise<Task> => {
  if (text.trim() === '') {
    throw new Error('Task text cannot be empty');
  }

  try {
    const response: AxiosResponse<BackendTask> = await axios.post(
      API_URL, 
      { title: text.trim(), description: '' }, 
      getAuthConfig()
    );

    return mapBackendTask(response.data);
  } catch (err) {
    const apiError = err as ApiError;
    console.error('Error adding task:', apiError);
    throw apiError;
  }
};

/**
 * Toggle the 'done' status of a task via API
 * @param id The task ID
 * @param currentDoneStatus The current 'done' status
 * @returns The updated Task
 * @throws ApiError if updating fails
 */
export const toggleTaskDone = async (id: number, currentDoneStatus: boolean): Promise<Task> => {
  try {
    const response: AxiosResponse<BackendTask> = await axios.put(
      `${API_URL}/${id}`, 
      { completed: !currentDoneStatus }, 
      getAuthConfig()
    );

    return mapBackendTask(response.data);
  } catch (err) {
    const apiError = err as ApiError;
    console.error('Error toggling task:', apiError);
    throw apiError;
  }
};

/**
 * Delete a task via API
 * @param id The task ID
 * @throws ApiError if deletion fails
 */
export const deleteTask = async (id: number): Promise<void> => {
  try {
    await axios.delete<void>(`${API_URL}/${id}`, getAuthConfig());
  } catch (err) {
    const apiError = err as ApiError;
    console.error('Error deleting task:', apiError);
    throw apiError;
  }
};

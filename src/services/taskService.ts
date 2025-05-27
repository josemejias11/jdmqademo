// Task service functions
import apiClient from '../utils/apiClient';
import { Task, ApiError } from '../types';
import { getAuthConfig } from '../utils/authUtils';

const API_URL = '/api/tasks';

/**
 * Fetch all tasks from the API
 * @returns Array of Task objects
 * @throws ApiError if fetching fails
 */
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await apiClient.get<Task[]>(API_URL, getAuthConfig());
    return response.data;
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
    const response = await apiClient.post<Task>(
      API_URL,
      { title: text.trim(), description: '' },
      getAuthConfig()
    );

    return response.data;
  } catch (err) {
    const apiError = err as ApiError;
    console.error('Error adding task:', apiError);
    throw apiError;
  }
};

/**
 * Toggle the 'done' status of a task via API
 * @param id The task ID
 * @param currentCompletedStatus The current 'completed' status
 * @returns The updated Task
 * @throws ApiError if updating fails
 */
export const toggleTaskDone = async (
  id: number,
  currentCompletedStatus: boolean
): Promise<Task> => {
  try {
    const response = await apiClient.put<Task>(
      `${API_URL}/${id}`,
      { completed: !currentCompletedStatus },
      getAuthConfig()
    );

    return response.data;
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
    await apiClient.delete<void>(`${API_URL}/${id}`, getAuthConfig());
  } catch (err) {
    const apiError = err as ApiError;
    console.error('Error deleting task:', apiError);
    throw apiError;
  }
};

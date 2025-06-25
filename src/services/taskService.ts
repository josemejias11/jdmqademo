// noinspection ExceptionCaughtLocallyJS

import apiClient from '../utils/apiClient';
import { getAuthConfig } from '../utils/authUtils';
import { Task } from '../types';

// Task form values interface
export interface TaskFormValues {
  title: string;
  description: string;
  completed: boolean;
}

// API Error interface
export interface ApiError {
  message: string;
  status?: number;

  [key: string]: unknown;
}

const API_URL = '/tasks';

/**
 * Get all tasks for the current user
 * @returns Promise with all tasks
 * @throws ApiError if fetching fails
 */
export const getTasks = async (): Promise<{ success: boolean; data: Task[] }> => {
  try {
    const config = getAuthConfig();
    const response = await apiClient.get(API_URL, config);
    return response.data;
  } catch (err: unknown) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: err instanceof Error ? err.message : 'Failed to fetch tasks',
      status:
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined
    } as ApiError;
  }
};

/**
 * Get a specific task by ID
 * @param id The task ID
 * @returns Promise with the requested task
 * @throws ApiError if fetching fails
 */
export const getTaskById = async (id: string): Promise<{ success: boolean; data: Task }> => {
  try {
    const config = getAuthConfig();
    const response = await apiClient.get(`${API_URL}/${id}`, config);
    return response.data;
  } catch (err: unknown) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: err instanceof Error ? err.message : `Failed to fetch task ${id}`,
      status:
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined
    } as ApiError;
  }
};

/**
 * Create a new task
 * @param taskData The task data
 * @returns Promise with the created task
 * @throws ApiError if creation fails
 */
export const createTask = async (
  taskData: TaskFormValues
): Promise<{ success: boolean; data: Task }> => {
  try {
    if (!taskData.title || taskData.title.trim() === '') {
      throw new Error('Task title cannot be empty');
    }

    const config = getAuthConfig();
    const response = await apiClient.post(API_URL, taskData, config);
    return response.data;
  } catch (err: unknown) {
    // Convert unknown error to ApiError
    // eslint-disable-next-line no-throw-literal
    throw {
      message: err instanceof Error ? err.message : 'Failed to create task',
      status:
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined
    } as ApiError;
  }
};

/**
 * Update an existing task
 * @param id The task ID to update
 * @param taskData The updated task data
 * @returns Promise with the updated task
 * @throws ApiError if update fails
 */
export const updateTask = async (
  id: string,
  taskData: Partial<TaskFormValues>
): Promise<{ success: boolean; data: Task }> => {
  try {
    const config = getAuthConfig();
    const response = await apiClient.put(`${API_URL}/${id}`, taskData, config);
    return response.data;
  } catch (err: unknown) {
    // Convert unknown error to ApiError
    // eslint-disable-next-line no-throw-literal
    throw {
      message: err instanceof Error ? err.message : `Failed to update task ${id}`,
      status:
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined
    } as ApiError;
  }
};

/**
 * Delete a task
 * @param id The task ID to delete
 * @returns Promise with the deletion result
 * @throws ApiError if deletion fails
 */
export const deleteTask = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const config = getAuthConfig();
    const response = await apiClient.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (err: unknown) {
    // Convert unknown error to ApiError
    // eslint-disable-next-line no-throw-literal
    throw {
      message: err instanceof Error ? err.message : `Failed to delete task ${id}`,
      status:
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined
    } as ApiError;
  }
};

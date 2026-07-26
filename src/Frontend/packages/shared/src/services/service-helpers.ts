import { ApiResponse } from '../types/api.types';

export function unwrap<T>(response: { data: ApiResponse<T> }): T {
  if (response.data.success && response.data.data !== null) return response.data.data;
  throw new Error(response.data.message || 'The request did not return data.');
}
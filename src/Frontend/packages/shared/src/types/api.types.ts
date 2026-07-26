export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  message?: string;
  errors?: string[];
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  traceId?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
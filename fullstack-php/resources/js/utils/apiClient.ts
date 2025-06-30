import { router } from '@inertiajs/vue3';
import { errorHandler } from './errorHandler';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = '/api';
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      // If it's already an ApiError (from parseErrorResponse), re-throw it
      if (error && typeof error === 'object' && 'message' in error && 'status' in error) {
        throw error;
      }
      throw this.handleError(error);
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      // If it's already an ApiError (from parseErrorResponse), re-throw it
      if (error && typeof error === 'object' && 'message' in error && 'status' in error) {
        throw error;
      }
      throw this.handleError(error);
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      // If it's already an ApiError (from parseErrorResponse), re-throw it
      if (error && typeof error === 'object' && 'message' in error && 'status' in error) {
        throw error;
      }
      throw this.handleError(error);
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      // If it's already an ApiError (from parseErrorResponse), re-throw it
      if (error && typeof error === 'object' && 'message' in error && 'status' in error) {
        throw error;
      }
      throw this.handleError(error);
    }
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${endpoint}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    // Add CSRF token if available
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
      headers['X-CSRF-TOKEN'] = token;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await this.parseErrorResponse(response);
      throw errorData;
    }

    const data = await response.json();
    return {
      data,
      success: true,
    };
  }

  private async parseErrorResponse(response: Response): Promise<ApiError> {
    try {
      const errorData = await response.json();
      return {
        message: errorData.message || 'An error occurred',
        errors: errorData.errors,
        status: response.status,
      };
    } catch {
      return {
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }
  }

  private handleError(error: unknown): ApiError {
    // If it's already an ApiError object, return it as is
    if (error && typeof error === 'object' && 'message' in error && 'status' in error) {
      return error as ApiError;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        message: 'Network error. Please check your connection.',
      };
    }

    // If it has a message property but no status, extract just the message
    if (error && typeof error === 'object' && 'message' in error) {
      return {
        message: (error as any).message,
      };
    }

    return {
      message: 'An unexpected error occurred',
    };
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Convenience functions
export const api = {
  get: <T>(endpoint: string, params?: Record<string, any>) => apiClient.get<T>(endpoint, params),
  post: <T>(endpoint: string, data?: any) => apiClient.post<T>(endpoint, data),
  put: <T>(endpoint: string, data?: any) => apiClient.put<T>(endpoint, data),
  delete: <T>(endpoint: string) => apiClient.delete<T>(endpoint),
}; 
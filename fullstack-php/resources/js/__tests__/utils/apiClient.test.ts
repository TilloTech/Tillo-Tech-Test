import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { apiClient, api } from '@/utils/apiClient';

// Mock fetch globally
global.fetch = vi.fn();

// Mock document.querySelector for CSRF token
const mockQuerySelector = vi.fn();
Object.defineProperty(document, 'querySelector', {
  value: mockQuerySelector,
  writable: true,
});

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000',
  },
  writable: true,
});

describe('ApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuerySelector.mockReturnValue(null);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GET Requests', () => {
    it('should make successful GET request', async () => {
      const mockResponse = { data: { id: 1, name: 'Test' } };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.get('/test');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      expect(result).toEqual({
        data: mockResponse,
        success: true,
      });
    });

    it('should make GET request with query parameters', async () => {
      const mockResponse = { data: [] };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await apiClient.get('/test', { page: 1, limit: 10 });

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/test?page=1&limit=10', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
    });

    it('should handle undefined and null parameters', async () => {
      const mockResponse = { data: [] };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await apiClient.get('/test', { 
        valid: 'value', 
        undefined: undefined, 
        null: null 
      });

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/test?valid=value', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
    });
  });

  describe('POST Requests', () => {
    it('should make successful POST request', async () => {
      const mockResponse = { data: { id: 1 } };
      const postData = { name: 'Test' };
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.post('/test', postData);

      expect(fetch).toHaveBeenCalledWith('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(postData),
      });
      expect(result).toEqual({
        data: mockResponse,
        success: true,
      });
    });

    it('should make POST request without data', async () => {
      const mockResponse = { data: {} };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await apiClient.post('/test');

      expect(fetch).toHaveBeenCalledWith('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: undefined,
      });
    });
  });

  describe('PUT Requests', () => {
    it('should make successful PUT request', async () => {
      const mockResponse = { data: { id: 1, updated: true } };
      const putData = { name: 'Updated' };
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.put('/test/1', putData);

      expect(fetch).toHaveBeenCalledWith('/api/test/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(putData),
      });
      expect(result).toEqual({
        data: mockResponse,
        success: true,
      });
    });
  });

  describe('DELETE Requests', () => {
    it('should make successful DELETE request', async () => {
      const mockResponse = { data: { deleted: true } };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.delete('/test/1');

      expect(fetch).toHaveBeenCalledWith('/api/test/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      expect(result).toEqual({
        data: mockResponse,
        success: true,
      });
    });
  });

  describe('CSRF Token Handling', () => {
    it('should include CSRF token when available', async () => {
      const mockToken = 'csrf-token-123';
      mockQuerySelector.mockReturnValue({
        getAttribute: () => mockToken,
      });

      const mockResponse = { data: {} };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await apiClient.get('/test');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': mockToken,
        },
      });
    });

    it('should not include CSRF token when not available', async () => {
      mockQuerySelector.mockReturnValue(null);

      const mockResponse = { data: {} };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await apiClient.get('/test');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP error responses', async () => {
      const errorResponse = {
        message: 'Validation failed',
        errors: { field: ['Field is required'] },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        json: () => Promise.resolve(errorResponse),
      });

      await expect(apiClient.post('/test', {})).rejects.toEqual({
        message: 'Validation failed',
        errors: { field: ['Field is required'] },
        status: 422,
      });
    });

    it('should handle non-JSON error responses', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('Not JSON')),
      });

      await expect(apiClient.get('/test')).rejects.toEqual({
        message: 'HTTP 500: Internal Server Error',
        status: 500,
      });
    });

    it('should handle network errors', async () => {
      const networkError = new TypeError('fetch failed');
      (fetch as any).mockRejectedValueOnce(networkError);

      await expect(apiClient.get('/test')).rejects.toEqual({
        message: 'Network error. Please check your connection.',
      });
    });

    it('should handle unknown errors', async () => {
      const unknownError = new Error('Unknown error');
      (fetch as any).mockRejectedValueOnce(unknownError);

      await expect(apiClient.get('/test')).rejects.toEqual({
        message: 'Unknown error',
      });
    });

    it('should handle error objects with message property', async () => {
      const errorWithMessage = { message: 'Custom error message' };
      (fetch as any).mockRejectedValueOnce(errorWithMessage);

      await expect(apiClient.get('/test')).rejects.toEqual({
        message: 'Custom error message',
      });
    });
  });

  describe('URL Building', () => {
    it('should build correct URLs with base path', () => {
      // Test the private buildUrl method through a public method
      const mockResponse = { data: {} };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      apiClient.get('/users');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/users', expect.any(Object));
    });

    it('should handle complex query parameters', async () => {
      const mockResponse = { data: [] };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await apiClient.get('/search', {
        q: 'test query',
        category: 'electronics',
        price_min: 10,
        price_max: 100,
        in_stock: true,
      });

      const expectedUrl = 'http://localhost:3000/api/search?q=test+query&category=electronics&price_min=10&price_max=100&in_stock=true';
      expect(fetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
    });
  });

  describe('Convenience Functions', () => {
    it('should provide working convenience functions', async () => {
      const mockResponse = { data: { id: 1 } };
      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      // Test all convenience functions
      await api.get('/test');
      await api.post('/test', { data: 'test' });
      await api.put('/test/1', { data: 'updated' });
      await api.delete('/test/1');

      expect(fetch).toHaveBeenCalledTimes(4);
    });
  });

  describe('TypeScript Support', () => {
    it('should support generic types', async () => {
      interface User {
        id: number;
        name: string;
      }

      const mockResponse = { id: 1, name: 'John' };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.get<User>('/users/1');

      expect(result.data).toEqual({ id: 1, name: 'John' });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty response body', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(null),
      });

      const result = await apiClient.get('/test');

      expect(result).toEqual({
        data: null,
        success: true,
      });
    });

    it('should handle response with only message', async () => {
      const mockResponse = { message: 'Success' };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.get('/test');

      expect(result).toEqual({
        data: mockResponse,
        success: true,
      });
    });
  });
}); 
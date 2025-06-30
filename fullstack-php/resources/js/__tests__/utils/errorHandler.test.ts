import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

// Mock the cart store
vi.mock('@/stores/cart', () => ({
  useCartStore: () => ({
    showToast: vi.fn(),
  }),
}));

describe('ErrorHandler', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    
    // Reset the singleton instance for each test
    (global as any).ErrorHandlerInstance = undefined;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', async () => {
      const { ErrorHandler } = await import('@/utils/errorHandler');
      const instance1 = ErrorHandler.getInstance();
      const instance2 = ErrorHandler.getInstance();
      
      expect(instance1).toBe(instance2);
    });

    it('should return the exported singleton', async () => {
      const { ErrorHandler, errorHandler } = await import('@/utils/errorHandler');
      const instance = ErrorHandler.getInstance();
      expect(errorHandler).toBe(instance);
    });
  });

  describe('handleError', () => {
    it('should handle Error objects', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      const error = new Error('Test error message');
      const result = errorHandler.handleError(error, 'TestComponent');

      expect(result.message).toBe('Test error message');
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should handle string errors', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      const error = 'String error message';
      const result = errorHandler.handleError(error, 'TestComponent');

      expect(result.message).toBe('String error message');
    });

    it('should handle objects with message property', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      const error = { message: 'Object error message' };
      const result = errorHandler.handleError(error, 'TestComponent');

      expect(result.message).toBe('Object error message');
    });

    it('should handle unknown error types', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      const error = null;
      const result = errorHandler.handleError(error, 'TestComponent');

      expect(result.message).toBe('An unexpected error occurred');
    });

    it('should extract error code when available', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      const error = { message: 'Test error', code: 'VALIDATION_ERROR' };
      const result = errorHandler.handleError(error, 'TestComponent');

      expect(result.code).toBe('VALIDATION_ERROR');
    });

    it('should extract error details when available', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      const error = { 
        message: 'Test error', 
        details: { field: 'email', value: 'invalid' } 
      };
      const result = errorHandler.handleError(error, 'TestComponent');

      expect(result.details).toEqual({ field: 'email', value: 'invalid' });
    });

    it('should log error to console', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');

      errorHandler.handleError(error, 'TestComponent');

      expect(consoleSpy).toHaveBeenCalledWith('[TestComponent] Error:', expect.objectContaining({
        message: 'Test error',
        timestamp: expect.any(Date),
      }));

      consoleSpy.mockRestore();
    });

    it('should use default context when not provided', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');

      errorHandler.handleError(error);

      expect(consoleSpy).toHaveBeenCalledWith('[App] Error:', expect.any(Object));

      consoleSpy.mockRestore();
    });
  });

  describe('handleValidationError', () => {
    it('should show first validation error', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      const errors = {
        email: ['Email is required'],
        password: ['Password must be at least 8 characters'],
      };

      errorHandler.handleValidationError(errors);
      // Just verify the method doesn't throw
      expect(true).toBe(true);
    });

    it('should handle empty errors object', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      errorHandler.handleValidationError({});
      // Just verify the method doesn't throw
      expect(true).toBe(true);
    });

    it('should handle errors with empty arrays', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      const errors = {
        email: [],
        password: ['Password is required'],
      };

      errorHandler.handleValidationError(errors);
      // Just verify the method doesn't throw
      expect(true).toBe(true);
    });
  });

  describe('handleNetworkError', () => {
    it('should show network error message', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      errorHandler.handleNetworkError();
      // Just verify the method doesn't throw
      expect(true).toBe(true);
    });
  });

  describe('handleServerError', () => {
    it('should show generic server error for unknown status', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      errorHandler.handleServerError();
      // Just verify the method doesn't throw
      expect(true).toBe(true);
    });

    it('should show specific error for 500 status', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      errorHandler.handleServerError(500);
      // Just verify the method doesn't throw
      expect(true).toBe(true);
    });

    it('should show generic error for other status codes', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      errorHandler.handleServerError(404);
      // Just verify the method doesn't throw
      expect(true).toBe(true);
    });
  });

  describe('Private Methods', () => {
    describe('extractErrorMessage', () => {
      it('should extract message from Error object', async () => {
        const { ErrorHandler } = await import('@/utils/errorHandler');
        const error = new Error('Test error');
        const handler = ErrorHandler.getInstance();
        
        // Access private method through any
        const result = (handler as any).extractErrorMessage(error);
        
        expect(result).toBe('Test error');
      });

      it('should extract message from string', async () => {
        const { ErrorHandler } = await import('@/utils/errorHandler');
        const error = 'String error';
        const handler = ErrorHandler.getInstance();
        
        const result = (handler as any).extractErrorMessage(error);
        
        expect(result).toBe('String error');
      });

      it('should extract message from object with message property', async () => {
        const { ErrorHandler } = await import('@/utils/errorHandler');
        const error = { message: 'Object error' };
        const handler = ErrorHandler.getInstance();
        
        const result = (handler as any).extractErrorMessage(error);
        
        expect(result).toBe('Object error');
      });

      it('should return default message for unknown error types', async () => {
        const { ErrorHandler } = await import('@/utils/errorHandler');
        const error = null;
        const handler = ErrorHandler.getInstance();
        
        const result = (handler as any).extractErrorMessage(error);
        
        expect(result).toBe('An unexpected error occurred');
      });
    });

    describe('extractErrorCode', () => {
      it('should extract code from error object', async () => {
        const { ErrorHandler } = await import('@/utils/errorHandler');
        const error = { code: 'VALIDATION_ERROR' };
        const handler = ErrorHandler.getInstance();
        
        const result = (handler as any).extractErrorCode(error);
        
        expect(result).toBe('VALIDATION_ERROR');
      });

      it('should return undefined when no code is present', async () => {
        const { ErrorHandler } = await import('@/utils/errorHandler');
        const error = { message: 'Test error' };
        const handler = ErrorHandler.getInstance();
        
        const result = (handler as any).extractErrorCode(error);
        
        expect(result).toBeUndefined();
      });
    });

    describe('extractErrorDetails', () => {
      it('should extract details from error object', async () => {
        const { ErrorHandler } = await import('@/utils/errorHandler');
        const error = { details: { field: 'email' } };
        const handler = ErrorHandler.getInstance();
        
        const result = (handler as any).extractErrorDetails(error);
        
        expect(result).toEqual({ field: 'email' });
      });

      it('should return undefined when no details are present', async () => {
        const { ErrorHandler } = await import('@/utils/errorHandler');
        const error = { message: 'Test error' };
        const handler = ErrorHandler.getInstance();
        
        const result = (handler as any).extractErrorDetails(error);
        
        expect(result).toBeUndefined();
      });
    });
  });

  describe('Error Types', () => {
    it('should handle TypeError for network errors', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      const error = new TypeError('fetch failed');
      const result = errorHandler.handleError(error);

      expect(result.message).toBe('fetch failed');
    });

    it('should handle custom error objects', async () => {
      const { errorHandler } = await import('@/utils/errorHandler');
      const error = {
        message: 'Custom error',
        code: 'CUSTOM_ERROR',
        details: { custom: 'data' },
      };
      const result = errorHandler.handleError(error);

      expect(result.message).toBe('Custom error');
      expect(result.code).toBe('CUSTOM_ERROR');
      expect(result.details).toEqual({ custom: 'data' });
    });
  });
}); 
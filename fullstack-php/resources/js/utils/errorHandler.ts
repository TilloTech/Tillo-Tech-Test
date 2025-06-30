import { useCartStore } from '@/stores/cart';

export interface AppError {
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private cartStore = useCartStore();

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: unknown, context?: string): AppError {
    const appError: AppError = {
      message: this.extractErrorMessage(error),
      code: this.extractErrorCode(error),
      details: this.extractErrorDetails(error),
      timestamp: new Date(),
    };

    // Log error for debugging
    console.error(`[${context || 'App'}] Error:`, appError);

    // Show user-friendly toast
    this.cartStore.showToast(appError.message, 'error');

    return appError;
  }

  handleValidationError(errors: Record<string, string[]>): void {
    const firstError = Object.values(errors)[0]?.[0];
    if (firstError) {
      this.cartStore.showToast(firstError, 'error');
    }
  }

  handleNetworkError(): void {
    this.cartStore.showToast('Network error. Please check your connection and try again.', 'error');
  }

  handleServerError(status?: number): void {
    const message = status === 500 
      ? 'Server error. Please try again later.'
      : 'Something went wrong. Please try again.';
    
    this.cartStore.showToast(message, 'error');
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    
    return 'An unexpected error occurred';
  }

  private extractErrorCode(error: unknown): string | undefined {
    if (error && typeof error === 'object' && 'code' in error) {
      return String(error.code);
    }
    return undefined;
  }

  private extractErrorDetails(error: unknown): Record<string, any> | undefined {
    if (error && typeof error === 'object' && 'details' in error) {
      return error.details as Record<string, any>;
    }
    return undefined;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance(); 
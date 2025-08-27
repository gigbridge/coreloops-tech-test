import { toast } from 'sonner';

// Error types for better error handling
export interface ApiError {
  status: number;
  message: string;
  details?: string;
}

export interface NetworkError {
  type: 'network';
  message: string;
}

export interface ValidationError {
  type: 'validation';
  field: string;
  message: string;
}

export type AppError = ApiError | NetworkError | ValidationError;

// Parse error from API response or network error
export function parseError(error: unknown): AppError {
  // Handle network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: 'network',
      message: 'Network connection failed. Please check your internet connection.',
    };
  }

  // Handle API errors
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message) as { status?: number; message?: string; details?: string };
      if (typeof parsed === 'object' && parsed !== null && 'status' in parsed) {
        return {
          status: parsed.status ?? 500,
          message: parsed.message ?? 'An unexpected error occurred',
          details: parsed.details,
        };
      }
    } catch {
      // If parsing fails, treat as generic error
    }

    return {
      status: 500,
      message: error.message || 'An unexpected error occurred',
    };
  }

  // Fallback for unknown error types
  return {
    status: 500,
    message: 'An unexpected error occurred',
  };
}

// Get user-friendly error message
export function getErrorMessage(error: AppError): string {
  if ('type' in error) {
    switch (error.type) {
      case 'network':
        return error.message;
      case 'validation':
        return `${error.field}: ${error.message}`;
      default:
        return 'An unexpected error occurred';
    }
  }

  // Handle API errors
  switch (error.status) {
    case 400:
      return error.message || 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication required. Please log in.';
    case 403:
      return error.message || 'You do not have permission to perform this action.';
    case 404:
      return error.message || 'The requested resource was not found.';
    case 409:
      return error.message || 'A conflict occurred. The resource may already exist.';
    case 422:
      return error.message || 'Invalid data provided. Please check your input.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred';
  }
}

// Show error toast with appropriate message
export function showErrorToast(error: unknown, title = 'Error') {
  const parsedError = parseError(error);
  const message = getErrorMessage(parsedError);

  toast.error(title, {
    description: message,
    duration: 5000,
  });
}

// Show success toast
export function showSuccessToast(title: string, description?: string) {
  toast.success(title, {
    description,
    duration: 4000,
  });
}

// Retry mechanism with exponential backoff
export class RetryManager {
  private attempts = 0;
  private maxAttempts: number;
  private baseDelay: number;

  constructor(maxAttempts = 3, baseDelay = 1000) {
    this.maxAttempts = maxAttempts;
    this.baseDelay = baseDelay;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    while (this.attempts < this.maxAttempts) {
      try {
        const result = await fn();
        this.reset();
        return result;
      } catch (error) {
        this.attempts++;

        if (this.attempts >= this.maxAttempts) {
          throw error;
        }

        // Exponential backoff with jitter
        const delay = this.baseDelay * Math.pow(2, this.attempts - 1);
        const jitter = Math.random() * 0.1 * delay;
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
      }
    }

    throw new Error('Max retry attempts exceeded');
  }

  reset() {
    this.attempts = 0;
  }

  get canRetry(): boolean {
    return this.attempts < this.maxAttempts;
  }

  get attemptsRemaining(): number {
    return Math.max(0, this.maxAttempts - this.attempts);
  }
}

import { toast } from 'sonner';
import { getErrorMessage, parseError, RetryManager, showErrorToast, showSuccessToast } from '../error-handling';

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockToast = toast as jest.Mocked<typeof toast>;

describe('Error Handling Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseError', () => {
    it('parses API errors correctly', () => {
      const error = new Error(JSON.stringify({ status: 404, message: 'Not found' }));
      const result = parseError(error);

      expect(result).toEqual({
        status: 404,
        message: 'Not found',
      });
    });

    it('handles network errors', () => {
      const error = new TypeError('fetch failed');
      const result = parseError(error);

      expect(result).toEqual({
        type: 'network',
        message: 'Network connection failed. Please check your internet connection.',
      });
    });

    it('handles generic errors', () => {
      const error = new Error('Generic error');
      const result = parseError(error);

      expect(result).toEqual({
        status: 500,
        message: 'Generic error',
      });
    });

    it('handles unknown error types', () => {
      const result = parseError('string error');

      expect(result).toEqual({
        status: 500,
        message: 'An unexpected error occurred',
      });
    });
  });

  describe('getErrorMessage', () => {
    it('returns appropriate message for 403 errors', () => {
      const error = { status: 403, message: 'Forbidden' };
      const result = getErrorMessage(error);

      expect(result).toBe('Forbidden');
    });

    it('returns default message for 403 without custom message', () => {
      const error = { status: 403, message: '' };
      const result = getErrorMessage(error);

      expect(result).toBe('You do not have permission to perform this action.');
    });

    it('handles network errors', () => {
      const error = { type: 'network' as const, message: 'Network failed' };
      const result = getErrorMessage(error);

      expect(result).toBe('Network failed');
    });

    it('handles validation errors', () => {
      const error = { type: 'validation' as const, field: 'email', message: 'Invalid format' };
      const result = getErrorMessage(error);

      expect(result).toBe('email: Invalid format');
    });
  });

  describe('showErrorToast', () => {
    it('shows error toast with parsed message', () => {
      const error = new Error(JSON.stringify({ status: 404, message: 'Not found' }));

      showErrorToast(error, 'Custom Title');

      expect(mockToast.error).toHaveBeenCalledWith('Custom Title', {
        description: 'Not found',
        duration: 5000,
      });
    });
  });

  describe('showSuccessToast', () => {
    it('shows success toast', () => {
      showSuccessToast('Success!', 'Operation completed');

      expect(mockToast.success).toHaveBeenCalledWith('Success!', {
        description: 'Operation completed',
        duration: 4000,
      });
    });
  });

  describe('RetryManager', () => {
    it('executes function successfully on first try', async () => {
      const retryManager = new RetryManager(3, 100);
      const mockFn = jest.fn().mockResolvedValue('success');

      const result = await retryManager.execute(mockFn);

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('retries on failure and eventually succeeds', async () => {
      const retryManager = new RetryManager(3, 10); // Short delay for testing
      const mockFn = jest
        .fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue('success');

      const result = await retryManager.execute(mockFn);

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('throws error after max retries exceeded', async () => {
      const retryManager = new RetryManager(2, 10);
      const mockFn = jest.fn().mockRejectedValue(new Error('Always fails'));

      await expect(retryManager.execute(mockFn)).rejects.toThrow('Always fails');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('resets attempts after successful execution', async () => {
      const retryManager = new RetryManager(3, 10);
      const mockFn = jest.fn().mockResolvedValue('success');

      await retryManager.execute(mockFn);
      expect(retryManager.canRetry).toBe(true);
      expect(retryManager.attemptsRemaining).toBe(3);
    });
  });
});

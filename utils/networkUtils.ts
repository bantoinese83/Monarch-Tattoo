export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('timeout') ||
      message.includes('connection') ||
      message.includes('offline')
    );
  }
  return false;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (isNetworkError(error)) {
      return 'Network error. Please check your internet connection and try again.';
    }
    return error.message || 'An unexpected error occurred.';
  }
  return 'An unexpected error occurred.';
};

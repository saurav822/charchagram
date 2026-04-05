'use client';

import { useState, useEffect } from 'react';

export function useErrorBoundary() {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Error caught by useErrorBoundary:', event.error);
      setError(event.error || new Error(event.message || 'Unknown error'));
      setHasError(true);
      event.preventDefault();
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      console.error('Promise rejection caught by useErrorBoundary:', event.reason);
      setError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
      setHasError(true);
      event.preventDefault();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
      setHasError(true);
      event.preventDefault();
    };

    // Set up global error handlers
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('rejectionhandled', handlePromiseRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('rejectionhandled', handlePromiseRejection);
    };
  }, []);

  const resetError = () => {
    setHasError(false);
    setError(null);
  };

  return { hasError, error, resetError };
}

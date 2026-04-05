'use client';

import React, { ReactNode, useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function FunctionalErrorBoundary({ children, fallback }: Props) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Error caught by FunctionalErrorBoundary:', event.error);
      setError(event.error || new Error(event.message || 'Unknown error'));
      setHasError(true);
      event.preventDefault();
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      console.error('Promise rejection caught by FunctionalErrorBoundary:', event.reason);
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

    // Handle synchronous errors
    const handleSyncError = (error: Error) => {
      console.error('Sync error caught by FunctionalErrorBoundary:', error);
      setError(error);
      setHasError(true);
    };

    // Override console.error to catch errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      
      args.forEach(arg => {
        if (arg instanceof Error) {
          handleSyncError(arg);
        }
      });
    };

    // Set up global error handlers
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('rejectionhandled', handlePromiseRejection);

    // Store original functions
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;

    // Override setTimeout with proper typing
    window.setTimeout = ((callback: Function, delay: number, ...args: any[]) => {
      return originalSetTimeout(() => {
        try {
          callback(...args);
        } catch (error) {
          console.error('Error in setTimeout callback:', error);
          // Handle the error appropriately
        }
      }, delay);
    }) as typeof window.setTimeout;

    // Override setInterval with proper typing
    window.setInterval = ((callback: Function, delay: number, ...args: any[]) => {
      return originalSetInterval(() => {
        try {
          callback(...args);
        } catch (error) {
          console.error('Error in setInterval callback:', error);
          // Handle the error appropriately
        }
      }, delay);
    }) as typeof window.setInterval;

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('rejectionhandled', handlePromiseRejection);
      
      // Restore original functions
      window.setTimeout = originalSetTimeout;
      window.setInterval = originalSetInterval;
      console.error = originalConsoleError;
    };
  }, []);

  if (hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
          </p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => {
                setHasError(false);
                setError(null);
              }}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-destructive/40 mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="bg-destructive/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-6 w-6" />
            </div>
            <CardTitle className="text-destructive">Something went wrong</CardTitle>
            <CardDescription>
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="bg-muted mt-4 rounded-md p-3 text-sm">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 text-xs whitespace-pre-wrap">{this.state.error.stack}</pre>
              </details>
            )}
          </CardContent>
          <CardFooter className="flex justify-center gap-2">
            <Button onClick={this.handleRetry} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()} size="sm">
              Refresh Page
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorBoundary() {
  return (error: Error) => {
    throw error;
  };
}

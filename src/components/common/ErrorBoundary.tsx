import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('InduSense View Error Caught:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center max-w-xl mx-auto my-8 space-y-4 font-mono">
          <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-800 flex items-center justify-center mx-auto text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-100">
              {this.props.fallbackTitle || 'Section Display Interrupted'}
            </h3>
            <p className="text-xs text-zinc-400 font-sans">
              {this.props.fallbackMessage || 'An unexpected rendering issue occurred. Click below to recover the workspace view.'}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset & Reload View</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in StayAura:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#11161B] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#1A2229] border border-[#C5A880]/30 rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880]">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold font-serif mb-2 text-[#E9D8B4]">Something Went Wrong</h1>
            <p className="text-sm text-gray-400 mb-6">
              StayAura encountered an unexpected error. Don't worry, your data and reservations are safe.
            </p>
            {this.state.error?.message && (
              <div className="mb-6 p-3 bg-red-950/40 border border-red-800/40 rounded-lg text-xs text-red-300 text-left overflow-auto max-h-24 font-mono">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C5A880] text-gray-950 text-xs font-bold hover:bg-[#d8be96] transition"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition"
              >
                <Home className="w-4 h-4" />
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

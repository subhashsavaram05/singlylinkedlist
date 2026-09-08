import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';

interface DeletionErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
  onBackToOverview?: () => void;
}

interface DeletionErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class DeletionErrorBoundary extends Component<
  DeletionErrorBoundaryProps,
  DeletionErrorBoundaryState
> {
  constructor(props: DeletionErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): DeletionErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unknown error occurred in deletion lesson component',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('DeletionErrorBoundary caught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0B1228] border border-rose-200 dark:border-rose-900/40 shadow-xs font-sans text-center space-y-4 my-4 animate-page-enter">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto shadow-2xs">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Unable to load this deletion lesson. Please try again.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We encountered a problem loading the requested deletion operation. You can retry loading the lesson or return to the Deletion Hub.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Lesson</span>
            </button>
            {this.props.onBackToOverview && (
              <button
                onClick={this.props.onBackToOverview}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Deletion Overview</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

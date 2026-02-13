"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  onReset?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[chat] Widget render error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed right-5 bottom-5 z-50 w-[22rem] rounded-2xl border border-red-200 bg-white p-4 shadow-2xl sm:w-[24rem]">
          <p className="text-sm font-semibold text-zinc-900">
            Something went wrong.
          </p>
          <p className="mt-1 text-xs text-zinc-600">Reset chat.</p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-4 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-zinc-700"
          >
            Something went wrong. Reset chat.
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

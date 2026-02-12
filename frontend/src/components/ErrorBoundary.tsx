"use client";

import React, { ReactNode } from "react";
import { GamePanel, GameButton } from "@/components/GameUI";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-[#0a0e27]">
          <GamePanel title="ERROR" className="max-w-md">
            <div className="space-y-4 text-[#ff0055]">
              <p className="font-mono text-sm">
                An unexpected error occurred:
              </p>
              <div className="bg-[#0a0e27] border border-[#ff0055] p-3 rounded text-xs max-h-32 overflow-y-auto">
                <code className="text-[#00ffff]">
                  {this.state.error?.message || "Unknown error"}
                </code>
              </div>
              <GameButton onClick={this.resetError} className="w-full">
                RETRY
              </GameButton>
            </div>
          </GamePanel>
        </div>
      );
    }

    return this.props.children;
  }
}

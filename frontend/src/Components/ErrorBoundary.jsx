import React from "react";
import AtmosphericBlooms from './AtmosphericBlooms';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center relative">
          <AtmosphericBlooms intensity="subtle" />
          <div className="glass glass-intense rounded-2xl p-10 max-w-md w-full text-center border border-subtle shadow-2xl">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-red-500/30 to-orange-500/30 border border-red-500/30">
              <svg
                className="w-10 h-10 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="font-section-headline gradient-text mb-3">
              Oops! Something went wrong
            </h2>
            <p className="dark:text-gray-400 text-gray-600 mb-8 leading-relaxed">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-gradient-primary py-3 px-8 rounded-lg font-semibold shadow-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

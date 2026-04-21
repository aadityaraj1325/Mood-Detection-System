import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || 'An unexpected UI error occurred.'
    };
  }

  componentDidCatch(error, errorInfo) {
    // Keep this for local debugging when the app is running in development mode.
    // eslint-disable-next-line no-console
    console.error('UI render error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('pm_token');
    window.location.assign('/auth');
  };

  render() {
    const { hasError, message } = this.state;

    if (hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-void p-6">
          <div className="glass-card w-full max-w-xl p-6">
            <h2 className="font-display text-2xl text-text-primary">Something went wrong</h2>
            <p className="mt-2 text-sm text-text-secondary">The app hit a render error and recovered into safe mode.</p>
            <p className="mt-2 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
              {message}
            </p>
            <button
              className="btn-primary mt-4"
              onClick={this.handleReset}
              type="button"
            >
              Reset Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

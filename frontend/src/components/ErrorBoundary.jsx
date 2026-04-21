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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.assign('/auth');
  };

  render() {
    const { hasError, message } = this.state;

    if (hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="glass neo-border w-full max-w-xl rounded-3xl p-6">
            <h2 className="font-display text-2xl text-slate-100">Something went wrong</h2>
            <p className="mt-2 text-sm text-slate-300">The app hit a render error and recovered into safe mode.</p>
            <p className="mt-2 text-sm text-rose-300">{message}</p>
            <button
              className="ripple-btn mt-4 rounded-xl border border-cyan-300/40 bg-cyan-300/15 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-300/25"
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

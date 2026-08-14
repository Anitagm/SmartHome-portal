import { Component } from 'react';

// A production app can't let one broken widget take the whole UI down with
// a blank white screen. This catches render errors anywhere below it and
// shows a recoverable fallback instead of crashing the tab.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-card">
            <h1>Something went wrong</h1>
            <p>An unexpected error interrupted this view. You can try reloading the page.</p>
            <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

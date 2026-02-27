import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #f87171', borderRadius: '1rem', margin: '2rem', fontFamily: 'monospace' }}>
                    <h2>Application Crash Caught</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.error && this.state.error.stack}
                    </details>
                    <button
                        onClick={() => { window.localStorage.clear(); window.location.reload(); }}
                        style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#dc2626', color: 'white', borderRadius: '0.5rem', cursor: 'pointer' }}
                    >
                        Clear Local Storage & Reload
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

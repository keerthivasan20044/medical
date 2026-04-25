import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldX } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2 bg-red-500" />
            
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <AlertTriangle size={40} />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">Something Went Wrong</h1>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We hit an unexpected error while loading this page. Please try refreshing or return to the home screen.
            </p>

            {this.state.error && (
              <details className="mb-8 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
                <summary className="text-xs font-semibold text-slate-500 cursor-pointer uppercase tracking-wider select-none">
                  Error Details
                </summary>
                <code className="block mt-2 text-[10px] text-red-500 font-mono break-all">
                  {this.state.error.message || this.state.error.toString()}
                </code>
              </details>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 py-4 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20"
              >
                <RefreshCw size={18} /> Refresh Page
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 py-4 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                <Home size={18} /> Go Home
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
              <ShieldX size={14} /> Error logged for review
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

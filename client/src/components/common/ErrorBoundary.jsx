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
    console.error("Enclave Crash Report:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-8">
           <div className="max-w-xl w-full bg-white rounded-[3rem] p-12 text-center space-y-8 relative overflow-hidden border-t-[12px] border-red-500 shadow-4xl">
              <div className="absolute top-0 right-0 h-40 w-40 bg-red-500 opacity-5 rounded-full blur-[80px]" />
              
              <div className="h-24 w-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto text-red-500 shadow-inner">
                 <ShieldX size={48} />
              </div>

              <div className="space-y-4">
                 <h2 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic leading-none tracking-tighter">Terminal <span className="text-red-500">Compromised</span></h2>
                 <p className="text-gray-400 font-dm text-lg italic font-bold">The clinical synchronization bridge has encountered an unexpected architecture failure.</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl border border-red-100/50 text-left font-mono text-[10px] text-red-400 overflow-x-auto">
                 {this.state.error?.toString()}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button 
                    onClick={() => window.location.reload()}
                    className="flex items-center justify-center gap-3 h-16 bg-[#0a1628] text-white rounded-2xl font-syne font-black text-xs uppercase tracking-widest hover:bg-[#028090] transition"
                 >
                    <RefreshCw size={18} /> Reboot Node
                 </button>
                 <button 
                    onClick={() => window.location.href = '/'}
                    className="flex items-center justify-center gap-3 h-16 bg-gray-50 text-gray-400 rounded-2xl font-syne font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition"
                 >
                    <Home size={18} /> Exit Enclave
                 </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase italic tracking-[0.4em] text-gray-200">
                 <AlertTriangle size={12}/> Emergency Override Status: Active
              </div>
           </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

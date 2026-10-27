import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-500/40 bg-slate-900/95 text-emerald-100 shadow-emerald-950/50',
    error: 'border-rose-500/40 bg-slate-900/95 text-rose-100 shadow-rose-950/50',
    info: 'border-cyan-500/40 bg-slate-900/95 text-cyan-100 shadow-cyan-950/50'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md animate-fade-in transition-all duration-300 max-w-md ${borderColors[type]}">
      {icons[type]}
      <p className="text-sm font-medium pr-2 text-slate-100">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors ml-auto"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;

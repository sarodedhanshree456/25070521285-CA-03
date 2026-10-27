import React from 'react';

export const MacroBar = ({
  current = 0,
  target = 100,
  label = 'Protein',
  unit = 'g',
  color = 'emerald'
}) => {
  const percentage = Math.min(100, target > 0 ? Math.round((current / target) * 100) : 0);

  const colorStyles = {
    emerald: {
      bar: 'bg-emerald-500',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    amber: {
      bar: 'bg-amber-500',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    cyan: {
      bar: 'bg-cyan-500',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    rose: {
      bar: 'bg-rose-500',
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    }
  }[color] || {
    bar: 'bg-emerald-500',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300">{label}</span>
        <span className="font-mono text-slate-400">
          <strong className={`font-bold ${colorStyles.text}`}>{current}</strong>
          {' / '}{target}{unit}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorStyles.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default MacroBar;

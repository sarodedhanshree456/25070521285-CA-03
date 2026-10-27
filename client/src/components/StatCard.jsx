import React from 'react';

export const StatCard = ({
  title,
  value,
  unit = '',
  subtitle,
  icon: Icon,
  trend,
  color = 'emerald'
}) => {
  const colorMap = {
    emerald: {
      iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      valueText: 'text-emerald-400'
    },
    cyan: {
      iconBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      valueText: 'text-cyan-400'
    },
    amber: {
      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      valueText: 'text-amber-400'
    },
    rose: {
      iconBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      valueText: 'text-rose-400'
    },
    indigo: {
      iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      valueText: 'text-indigo-400'
    }
  }[color] || {
    iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    valueText: 'text-emerald-400'
  };

  return (
    <div className="glass-card glass-card-hover p-5 rounded-3xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${colorMap.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
          {value}
        </span>
        {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
          <span>{subtitle}</span>
          {trend && (
            <span className="text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;

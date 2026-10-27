import React from 'react';
import { Droplet, Plus } from 'lucide-react';

export const WaterGlass = ({ amountMl = 0, goalMl = 2500, onAddWater }) => {
  const percentage = Math.min(100, Math.round((amountMl / goalMl) * 100));

  return (
    <div className="glass-card p-5 sm:p-6 rounded-3xl flex flex-col items-center text-center">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Droplet className="w-4 h-4 fill-cyan-400" />
          </div>
          <span className="text-sm font-bold text-white">Daily Hydration</span>
        </div>
        <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
          {percentage}% Goal
        </span>
      </div>

      {/* Visual Animated Tumbler / Glass */}
      <div className="relative w-28 h-40 sm:w-32 sm:h-44 border-4 border-slate-700/80 rounded-b-3xl rounded-t-lg bg-slate-900/60 overflow-hidden shadow-inner flex flex-col justify-end p-1 my-2">
        {/* Measurement Lines */}
        <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20 z-10">
          <div className="border-b border-white w-4" />
          <div className="border-b border-white w-6" />
          <div className="border-b border-white w-4" />
          <div className="border-b border-white w-6" />
          <div className="border-b border-white w-4" />
        </div>

        {/* Liquid level */}
        <div
          className="w-full bg-gradient-to-t from-cyan-600 via-cyan-500 to-sky-400 rounded-b-2xl transition-all duration-700 ease-out relative"
          style={{ height: `${Math.max(8, percentage)}%` }}
        >
          {/* Animated Wave Top */}
          <div className="absolute -top-2 left-0 right-0 h-3 bg-sky-300 opacity-60 rounded-full animate-pulse" />
        </div>

        {/* Center Text inside tumbler */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <span className="text-lg sm:text-xl font-extrabold text-white drop-shadow-md">
            {amountMl} <span className="text-xs font-normal text-slate-200">ml</span>
          </span>
          <span className="text-[10px] text-slate-300 drop-shadow">
            of {goalMl} ml
          </span>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="flex items-center gap-2 mt-4 w-full">
        <button
          onClick={() => onAddWater && onAddWater(150)}
          className="flex-1 py-2 px-1 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700/60 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-all flex items-center justify-center gap-1 active:scale-95"
          title="Add small glass (150ml)"
        >
          <Plus className="w-3 h-3" /> 150ml
        </button>
        <button
          onClick={() => onAddWater && onAddWater(250)}
          className="flex-1 py-2 px-1 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700/60 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-all flex items-center justify-center gap-1 active:scale-95"
          title="Add standard mug (250ml)"
        >
          <Plus className="w-3 h-3" /> 250ml
        </button>
        <button
          onClick={() => onAddWater && onAddWater(500)}
          className="flex-1 py-2 px-1 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700/60 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-all flex items-center justify-center gap-1 active:scale-95"
          title="Add full bottle (500ml)"
        >
          <Plus className="w-3 h-3" /> 500ml
        </button>
      </div>
    </div>
  );
};

export default WaterGlass;

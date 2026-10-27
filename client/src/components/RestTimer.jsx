import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Timer, Bell } from 'lucide-react';

export const RestTimer = ({ initialSeconds = 60, onTimerComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      if (onTimerComplete) onTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, onTimerComplete]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = (newSecs = totalSeconds) => {
    setIsActive(false);
    setSecondsLeft(newSecs);
  };

  const setPreset = (secs) => {
    setTotalSeconds(secs);
    resetTimer(secs);
  };

  const adjustTime = (delta) => {
    setSecondsLeft((prev) => Math.max(5, prev + delta));
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="glass-card p-5 rounded-3xl border border-slate-700/80 bg-[#0E1526]/90 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Timer className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white">Set Rest Timer</span>
        </div>
        {secondsLeft === 0 ? (
          <span className="animate-bounce inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
            <Bell className="w-3 h-3" /> Time to Lift!
          </span>
        ) : (
          <span className="text-xs text-slate-400 font-medium">Keep Intensity High</span>
        )}
      </div>

      {/* Main Timer Display */}
      <div className="flex flex-col items-center justify-center py-4 relative">
        {/* Circular Progress Ring */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-slate-800"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-emerald-400 transition-all duration-300"
              strokeWidth="6"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white font-mono tracking-tight">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
              Rest Left
            </span>
          </div>
        </div>
      </div>

      {/* Adjust buttons */}
      <div className="flex items-center justify-center gap-3 my-2">
        <button
          onClick={() => adjustTime(-15)}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
          title="Minus 15 seconds"
        >
          <Minus className="w-3.5 h-3.5" /> 15s
        </button>
        
        <button
          onClick={toggleTimer}
          className={`px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
          {isActive ? 'Pause' : 'Start Rest'}
        </button>

        <button
          onClick={() => adjustTime(15)}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
          title="Plus 15 seconds"
        >
          <Plus className="w-3.5 h-3.5" /> 15s
        </button>

        <button
          onClick={() => resetTimer()}
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Reset timer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Preset intervals */}
      <div className="grid grid-cols-4 gap-1.5 mt-4 pt-3 border-t border-slate-800/80">
        {[30, 60, 90, 120].map((sec) => (
          <button
            key={sec}
            onClick={() => setPreset(sec)}
            className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              totalSeconds === sec && !isActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {sec}s
          </button>
        ))}
      </div>
    </div>
  );
};

export default RestTimer;

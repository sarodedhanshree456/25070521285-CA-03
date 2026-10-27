import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-800/60 rounded-xl ${className}`} />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
};

export const TableSkeleton = ({ rows = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 glass-card rounded-xl">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;

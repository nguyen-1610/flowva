import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full flex-col bg-white p-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8 flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-md bg-slate-200"></div>
          <div className="h-4 w-32 rounded-md bg-slate-100"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 rounded-md bg-slate-100"></div>
          <div className="h-10 w-32 rounded-md bg-slate-200"></div>
        </div>
      </div>

      {/* Content Skeleton (mimics Board or List) */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex h-full w-80 shrink-0 flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-5 w-24 rounded bg-slate-200"></div>
              <div className="h-5 w-5 rounded bg-slate-100"></div>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="mb-3 h-4 w-3/4 rounded bg-slate-100"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-20 rounded bg-slate-50"></div>
                    <div className="h-6 w-6 rounded-full bg-slate-100"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

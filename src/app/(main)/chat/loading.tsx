import React from 'react';

export default function ChatLoading() {
  return (
    <div className="flex h-full w-full overflow-hidden bg-white animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="w-64 flex-shrink-0 border-r border-slate-200 bg-slate-50 p-4 space-y-6">
        <div className="h-6 w-32 rounded bg-slate-200 mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-200"></div>
              <div className="h-4 w-24 rounded bg-slate-100"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area Skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-slate-200 flex items-center px-6 justify-between">
          <div className="h-6 w-48 rounded bg-slate-200"></div>
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-full bg-slate-100"></div>
            <div className="h-8 w-8 rounded-full bg-slate-100"></div>
          </div>
        </div>
        
        <div className="flex-1 p-6 space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex gap-4 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
              <div className="h-10 w-10 rounded-full bg-slate-100"></div>
              <div className="space-y-2 max-w-[60%]">
                <div className="h-4 w-24 rounded bg-slate-50"></div>
                <div className="h-12 w-64 rounded-2xl bg-slate-100"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-200">
          <div className="h-20 w-full rounded-xl bg-slate-50 border border-slate-200"></div>
        </div>
      </div>
    </div>
  );
}

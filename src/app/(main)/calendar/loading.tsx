import React from 'react';

export default function CalendarLoading() {
  return (
    <div className="flex h-full w-full bg-white animate-pulse overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 p-6 space-y-8">
        <div className="h-10 w-full rounded-lg bg-slate-200"></div>
        <div className="space-y-4">
          <div className="h-40 w-full rounded-xl bg-slate-50"></div>
          <div className="h-4 w-32 rounded bg-slate-100"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-200"></div>
                <div className="h-3 w-20 rounded bg-slate-100"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Calendar Grid */}
      <div className="flex-1 flex flex-col p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-48 rounded bg-slate-200"></div>
          <div className="flex gap-2">
            <div className="h-10 w-32 rounded-md bg-slate-100"></div>
            <div className="h-10 w-24 rounded-md bg-slate-200"></div>
          </div>
        </div>

        <div className="flex-1 border border-slate-100 rounded-2xl grid grid-cols-7 grid-rows-5 overflow-hidden bg-slate-50/30">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="border border-slate-50 p-2">
              <div className="h-4 w-4 rounded bg-slate-100 mb-2"></div>
              {i % 7 === 0 && <div className="h-3 w-3/4 rounded bg-indigo-50"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

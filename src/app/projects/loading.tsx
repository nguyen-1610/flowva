import React from 'react';

export default function ProjectsLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="absolute top-0 left-0 flex w-full items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-slate-200"></div>
          <div className="h-6 w-24 rounded bg-slate-100"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="mb-12 w-full max-w-4xl text-center space-y-4">
        <div className="mx-auto h-12 w-3/4 rounded-lg bg-slate-200"></div>
        <div className="mx-auto h-6 w-1/2 rounded bg-slate-100"></div>
      </div>

      {/* Card Skeleton */}
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-5 w-40 rounded bg-slate-200"></div>
            <div className="h-4 w-24 rounded bg-slate-100"></div>
          </div>

          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-slate-50 bg-slate-50/50 p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-slate-200"></div>
                  <div className="space-y-2">
                    <div className="h-5 w-32 rounded bg-slate-200"></div>
                    <div className="h-3 w-48 rounded bg-slate-100"></div>
                  </div>
                </div>
                <div className="h-10 w-32 rounded-lg bg-slate-200"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-12 w-full border-t border-slate-100 bg-slate-50"></div>
      </div>
    </div>
  );
}

import React from 'react';

export const TaskBoardSkeleton = () => {
  return (
    <div className="flex h-full gap-6 overflow-x-auto p-6">
      {/* Simulate 3 generic columns */}
      {[1, 2, 3].map((colIndex) => (
        <div
          key={colIndex}
          className="flex h-full w-80 shrink-0 flex-col rounded-xl border border-slate-200/60 bg-slate-50/50 p-4"
        >
          {/* Column Header Skeleton */}
          <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-24 animate-pulse rounded bg-slate-200"></div>
            <div className="h-6 w-8 animate-pulse rounded-full bg-slate-200"></div>
          </div>

          {/* Task Card Skeletons */}
          <div className="flex-1 space-y-3 overflow-y-auto">
            {[1, 2, 3, 4].map((cardIndex) => (
              <div
                key={cardIndex}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                {/* Tag/Priority Skeleton */}
                <div className="mb-3 flex gap-2">
                  <div className="h-5 w-16 animate-pulse rounded bg-slate-100"></div>
                </div>

                {/* Title Skeleton */}
                <div className="mb-3 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100"></div>
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100"></div>
                </div>

                {/* Footer Skeleton (Avatar + Id) */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                  <div className="h-6 w-6 animate-pulse rounded-full bg-slate-200"></div>
                  <div className="h-3 w-12 animate-pulse rounded bg-slate-100"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoardSkeleton;

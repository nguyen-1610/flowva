import React from 'react';

export const TaskBacklogSkeleton = () => {
  return (
    <div className="space-y-4 p-6">
      {/* Header Skeleton */}
      <div className="mb-8 flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200"></div>
          <div className="h-4 w-64 animate-pulse rounded bg-slate-100"></div>
        </div>
        <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200"></div>
      </div>

      {/* List Header Skeleton */}
      <div className="mb-4 flex items-center rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="mr-4 h-4 w-6 animate-pulse rounded bg-slate-200"></div>
        <div className="mr-auto h-4 w-1/3 animate-pulse rounded bg-slate-200"></div>
        <div className="mr-8 h-4 w-20 animate-pulse rounded bg-slate-200"></div>
        <div className="mr-8 h-4 w-24 animate-pulse rounded bg-slate-200"></div>
        <div className="mr-8 h-4 w-20 animate-pulse rounded bg-slate-200"></div>
      </div>

      {/* List Items Skeleton */}
      <div className="space-y-2">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div
            key={index}
            className="flex items-center rounded-lg border border-slate-100 bg-white p-4 shadow-sm"
          >
            {/* Checkbox Placeholder */}
            <div className="mr-4 h-5 w-5 rounded border border-slate-200 bg-slate-50"></div>

            {/* Title & Id */}
            <div className="mr-auto grid gap-2">
              <div className="h-4 w-64 animate-pulse rounded bg-slate-100"></div>
              <div className="h-3 w-16 animate-pulse rounded bg-slate-50"></div>
            </div>

            {/* Status Pill */}
            <div className="mr-8 h-6 w-20 animate-pulse rounded-full bg-slate-100"></div>

            {/* Assignees */}
            <div className="mr-8 flex -space-x-1">
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 ring-2 ring-white"></div>
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 ring-2 ring-white"></div>
            </div>

            {/* Date */}
            <div className="mr-8 h-4 w-24 animate-pulse rounded bg-slate-100"></div>

            {/* Actions */}
            <div className="h-8 w-8 animate-pulse rounded bg-slate-50"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBacklogSkeleton;

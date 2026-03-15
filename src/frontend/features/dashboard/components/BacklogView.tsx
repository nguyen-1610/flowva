'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, ChevronDown, MoreHorizontal, GripVertical, Loader2 } from 'lucide-react';
import { useTasks } from '@/frontend/features/tasks/hooks/useTasks';
import { TaskBacklogSkeleton } from '@/frontend/features/tasks/components/TaskBacklogSkeleton';
import { cn } from '@/frontend/lib/utils';
import { TaskDTO } from '@/shared/types/task';

const BacklogView: React.FC = () => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');
  const { tasks, isLoading, isError } = useTasks(projectId);

  // In a real app, we'd also fetch Sprints. For now, we'll group by sprint_id presence.
  const sprintTasks = tasks?.filter((t) => t.sprint_id !== null) || [];
  const backlogTasks = tasks?.filter((t) => t.sprint_id === null) || [];

  if (!projectId) {
    return (
      <div className="flex h-full items-center justify-center bg-white p-8">
        <div className="text-center">
           <h2 className="text-xl font-bold text-slate-800">No Project Selected</h2>
           <p className="text-slate-500 mt-2">Please select a project from the sidebar or projects page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) return <TaskBacklogSkeleton />;

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900">Failed to load backlog</h3>
          <p className="text-slate-500">{isError.message || 'Please try again later.'}</p>
        </div>
      </div>
    );
  }

  const renderTaskRow = (task: TaskDTO) => (
    <div
      key={task.id}
      className="group flex cursor-pointer items-center gap-3 border-b border-slate-100 bg-white p-2.5 transition-colors hover:bg-slate-50"
    >
      <GripVertical
        size={16}
        className="cursor-move text-slate-300 opacity-0 group-hover:opacity-100"
      />
      <div
        className={cn(
          'flex h-4 w-4 items-center justify-center rounded border shadow-sm',
          task.priority === 'urgent' || task.priority === 'high'
            ? 'border-red-200 bg-red-50'
            : task.priority === 'medium'
              ? 'border-orange-200 bg-orange-50'
              : 'border-blue-200 bg-blue-50',
        )}
      >
        <div
          className={cn(
            'h-2 w-2 rounded-full',
            task.priority === 'urgent' || task.priority === 'high'
              ? 'bg-red-500'
              : task.priority === 'medium'
                ? 'bg-orange-500'
                : 'bg-blue-500',
          )}
        ></div>
      </div>
      <div className="min-w-0 flex-1">
        <span className="mr-2 font-mono text-[10px] text-slate-400 uppercase">{task.id.slice(0, 8)}</span>
        <span className="text-sm font-medium text-slate-700">{task.title}</span>
      </div>

      <div className="flex items-center gap-4 px-2">
        {task.tags && task.tags.length > 0 && (
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            {task.tags[0]}
          </span>
        )}

        <div className="flex w-16 -space-x-1">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-slate-200 text-[10px] font-bold text-slate-500">
            ?
          </div>
        </div>

        <div className="w-28 text-center">
          <span
            className={cn(
              'inline-block rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
              task.column_id
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-600',
            )}
          >
            {task.column_id ? 'IN BOARD' : 'BACKLOG'}
          </span>
        </div>

        <button className="cursor-pointer text-slate-400 hover:text-slate-600">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex-1 overflow-y-auto bg-white p-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Backlog</h2>
          <p className="mt-0.5 text-xs text-slate-500">Project View</p>
        </div>
        <div className="flex gap-2">
          <button className="cursor-pointer rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200">
            Insights
          </button>
          <button className="cursor-pointer rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-indigo-700">
            Create Issue
          </button>
        </div>
      </div>

      {/* Active Sprint Section (Mocking Sprint 24 for UI consistency) */}
      <div className="mb-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-50/50">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-slate-100 px-3 py-2">
          <div className="flex items-center gap-2">
            <ChevronDown size={14} className="text-slate-500" />
            <h3 className="text-xs font-bold text-slate-700">Sprint 24</h3>
            <span className="text-[10px] font-medium text-slate-400">
              (Active) • {sprintTasks.length} issues
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
              Oct 10 - Oct 24
            </span>
            <button className="cursor-pointer rounded p-1 hover:bg-slate-200">
              <MoreHorizontal size={14} className="text-slate-500" />
            </button>
          </div>
        </div>
        <div>
          {sprintTasks.length > 0 ? (
            sprintTasks.map(renderTaskRow)
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">No tasks in current sprint</div>
          )}
          <div className="cursor-text border-t border-slate-100 p-1.5 transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-2 p-1 text-slate-500">
              <Plus size={14} />
              <span className="text-xs">Create issue</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backlog Section */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-3 py-2">
          <div className="flex items-center gap-2">
            <ChevronDown size={14} className="text-slate-500" />
            <h3 className="text-xs font-bold text-slate-700">Backlog</h3>
            <span className="text-[10px] font-medium text-slate-400">{backlogTasks.length} issues</span>
          </div>
          <button className="cursor-pointer rounded bg-slate-200 px-2 py-1 text-[10px] font-bold text-slate-700 transition-colors hover:bg-slate-300">
            Create Sprint
          </button>
        </div>
        <div className="min-h-20">
          {backlogTasks.length > 0 ? (
            backlogTasks.map(renderTaskRow)
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">Backlog is empty</div>
          )}
          <div className="cursor-text border-t border-slate-100 p-1.5 transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-2 p-1 text-slate-500">
              <Plus size={14} />
              <span className="text-xs">Create issue</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacklogView;

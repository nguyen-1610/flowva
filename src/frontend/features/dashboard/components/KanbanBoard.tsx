'use client';

import React from 'react';
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import { MoreHorizontal, Plus, Calendar, Loader2 } from 'lucide-react';
import { useTasks } from '@/frontend/features/tasks/hooks/useTasks';
import { TaskBoardSkeleton } from '@/frontend/features/tasks/components/TaskBoardSkeleton';
import { cn } from '@/frontend/lib/utils';
import { getMockAvatar } from '@/frontend/lib/avatar-utils';
import { getColumnsAction } from '../actions';
import { BoardColumnDTO } from '@/shared/types/board';
import { TaskDTO } from '@/shared/types/task';

const KanbanBoard: React.FC = () => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');
  
  const { tasks, isLoading: tasksLoading, isError: tasksError } = useTasks(projectId);

  const { data: columns, error: columnsError, isLoading: columnsLoading } = useSWR<BoardColumnDTO[]>(
    projectId ? `/api/projects/${projectId}/columns` : null,
    async () => {
      if (!projectId) return [];
      const res = await getColumnsAction(projectId);
      if (!res.success) throw new Error(res.error);
      return res.data;
    }
  );

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

  if (tasksLoading || columnsLoading) return <TaskBoardSkeleton />;

  if (tasksError || columnsError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-slate-900">Failed to load board</h3>
          <p className="text-slate-500">{(tasksError || columnsError)?.message || 'Please try again later.'}</p>
        </div>
      </div>
    );
  }

  const allTasks = tasks || [];
  // Use real columns if available, fallback to defaults for UI demonstration if project is new
  const boardColumns = (columns && columns.length > 0) ? columns : [
    { id: 'todo', name: 'To Do', position: 0 },
    { id: 'in_progress', name: 'In Progress', position: 1 },
    { id: 'done', name: 'Done', position: 2 },
  ] as unknown as BoardColumnDTO[];

  return (
    <div className="h-full flex-1 overflow-x-auto overflow-y-hidden bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Sprint Board</h2>
          <p className="mt-0.5 text-xs text-slate-500">Software Development Workspace</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex cursor-pointer items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-indigo-700 shadow-md shadow-indigo-600/10 active:scale-[0.98]">
            <Plus size={14} /> New Issue
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100%-64px)] gap-4 pb-2">
        {boardColumns.map((col) => {
          const columnTasks = allTasks.filter((t) => t.column_id === col.id);

          return (
            <div
              key={col.id}
              className="flex h-full w-72 shrink-0 flex-col rounded-lg border border-slate-200 bg-slate-50/80"
            >
              <div
                className={cn(
                  'flex items-center justify-between rounded-t-lg border-t-2 bg-white p-2.5 shadow-sm border-t-indigo-500'
                )}
              >
                <h3 className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  {col.name}
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                    {columnTasks.length}
                  </span>
                </h3>
                <button className="cursor-pointer text-slate-400 hover:text-slate-600">
                  <MoreHorizontal size={14} />
                </button>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto p-2 scrollbar-hide">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group cursor-pointer rounded-lg border border-slate-100 bg-white p-3 shadow-sm transition-all hover:shadow-md hover:border-slate-200"
                  >
                    <div className="mb-1.5 flex items-start justify-between">
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                          task.priority === 'urgent' || task.priority === 'high'
                            ? 'bg-red-50 text-red-600'
                            : task.priority === 'medium'
                              ? 'bg-orange-50 text-orange-600'
                              : 'bg-blue-50 text-blue-600',
                        )}
                      >
                        {task.priority || 'MEDIUM'}
                      </span>
                      <button className="cursor-pointer text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-500">
                        <MoreHorizontal size={12} />
                      </button>
                    </div>
                    <h4 className="mb-2 text-xs leading-snug font-semibold text-slate-800 line-clamp-2">
                      {task.title}
                    </h4>

                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} className="text-slate-300" /> 
                          {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                        </span>
                      </div>
                      <div className="flex -space-x-1">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-indigo-50 text-[9px] font-bold text-indigo-600">
                          ?
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2 text-[10px] font-semibold text-slate-500 transition-all hover:border-indigo-300 hover:bg-white hover:text-indigo-600 hover:shadow-sm">
                  <Plus size={12} /> Create Task
                </button>
              </div>
            </div>
          );
        })}

        <div className="flex h-full w-72 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition-all hover:border-slate-300 hover:bg-slate-50/50 hover:text-slate-600 group">
          <div className="text-center">
            <Plus size={24} className="mx-auto mb-1 opacity-50 group-hover:opacity-100" />
            <span className="text-xs font-bold">Add Column</span>
          </div>
        </div>
      </div>
    </div>
  );

  );
};

export default KanbanBoard;

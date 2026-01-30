'use client';

import React from 'react';
import { Plus, ChevronDown, MoreHorizontal, User as UserIcon, GripVertical } from 'lucide-react';
import { Task, TaskStatus } from '@/shared/types/ui-types';
import { cn } from '@/frontend/lib/utils';

const mockBacklogTasks: Task[] = [
  {
    id: 't1',
    title: 'Design Homepage Mockup',
    status: TaskStatus.TODO,
    assignees: [],
    dueDate: 'Tomorrow',
    priority: 'High',
    tag: 'Design',
    sprint: 'Sprint 24',
  },
  {
    id: 't2',
    title: 'Integrate API Endpoints',
    status: TaskStatus.IN_PROGRESS,
    assignees: [],
    dueDate: 'Oct 24',
    priority: 'Medium',
    tag: 'Backend',
    sprint: 'Sprint 24',
  },
  {
    id: 't3',
    title: 'Write Documentation',
    status: TaskStatus.TODO,
    assignees: [],
    dueDate: 'Next Week',
    priority: 'Low',
    tag: 'Docs',
    sprint: 'Backlog',
  },
  {
    id: 't4',
    title: 'Fix Navigation Bug',
    status: TaskStatus.REVIEW,
    assignees: [],
    dueDate: 'Today',
    priority: 'High',
    tag: 'Bug',
    sprint: 'Sprint 24',
  },
  {
    id: 't6',
    title: 'Update Color Palette',
    status: TaskStatus.TODO,
    assignees: [],
    dueDate: 'Oct 30',
    priority: 'Low',
    tag: 'Design',
    sprint: 'Backlog',
  },
  {
    id: 't7',
    title: 'Database Migration',
    status: TaskStatus.TODO,
    assignees: [],
    dueDate: 'Nov 1',
    priority: 'High',
    tag: 'DevOps',
    sprint: 'Backlog',
  },
];

const BacklogView: React.FC = () => {
  const sprintTasks = mockBacklogTasks.filter((t) => t.sprint === 'Sprint 24');
  const backlogTasks = mockBacklogTasks.filter((t) => t.sprint === 'Backlog');

  const renderTaskRow = (task: Task) => (
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
          task.priority === 'High'
            ? 'border-red-200 bg-red-50'
            : task.priority === 'Medium'
              ? 'border-orange-200 bg-orange-50'
              : 'border-blue-200 bg-blue-50',
        )}
      >
        <div
          className={cn(
            'h-2 w-2 rounded-full',
            task.priority === 'High'
              ? 'bg-red-500'
              : task.priority === 'Medium'
                ? 'bg-orange-500'
                : 'bg-blue-500',
          )}
        ></div>
      </div>
      <div className="min-w-0 flex-1">
        <span className="mr-2 font-mono text-xs text-slate-400">{task.id.toUpperCase()}</span>
        <span className="text-sm font-medium text-slate-700">{task.title}</span>
      </div>

      <div className="flex items-center gap-4 px-2">
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
          {task.tag}
        </span>

        <div className="flex w-16 -space-x-1">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-slate-200 text-slate-400">
            <UserIcon size={12} />
          </div>
        </div>

        <div className="w-28 text-center">
          <span
            className={cn(
              'inline-block rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
              task.status === 'DONE'
                ? 'bg-green-100 text-green-700'
                : task.status === 'IN_PROGRESS'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600',
            )}
          >
            {task.status.replace('_', ' ')}
          </span>
        </div>

        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex-1 overflow-y-auto bg-white p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Backlog</h2>
          <p className="mt-1 text-sm text-slate-500">Project Alpha</p>
        </div>
        <div className="flex gap-2">
          <button className="cursor-pointer rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200">
            Insights
          </button>
          <button className="cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
            Complete Sprint
          </button>
        </div>
      </div>

      {/* Active Sprint Section */}
      <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-slate-100 p-4">
          <div className="flex items-center gap-2">
            <ChevronDown size={16} className="text-slate-500" />
            <h3 className="text-sm font-bold text-slate-700">Sprint 24</h3>
            <span className="text-xs font-medium text-slate-400">(Active) • 3 issues</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-600">
              Oct 10 - Oct 24
            </span>
            <button className="cursor-pointer rounded p-1 hover:bg-slate-200">
              <MoreHorizontal size={16} className="text-slate-500" />
            </button>
          </div>
        </div>
        <div>
          {sprintTasks.map(renderTaskRow)}
          <div className="cursor-text border-t border-slate-100 p-2 transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-2 p-1 text-slate-500">
              <Plus size={16} />
              <span className="text-sm">Create issue</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backlog Section */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 p-4">
          <div className="flex items-center gap-2">
            <ChevronDown size={16} className="text-slate-500" />
            <h3 className="text-sm font-bold text-slate-700">Backlog</h3>
            <span className="text-xs font-medium text-slate-400">{backlogTasks.length} issues</span>
          </div>
          <button className="cursor-pointer rounded bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-300">
            Create Sprint
          </button>
        </div>
        <div className="min-h-[100px]">
          {backlogTasks.map(renderTaskRow)}
          <div className="cursor-text border-t border-slate-100 p-2 transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-2 p-1 text-slate-500">
              <Plus size={16} />
              <span className="text-sm">Create issue</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacklogView;

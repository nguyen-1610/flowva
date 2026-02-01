'use client';

import React from 'react';
import { MoreHorizontal, Plus, Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { Task, TaskStatus, User } from '@/shared/types/ui-types';
import { cn } from '@/frontend/lib/utils';

const mockUsers: User[] = [
  { id: '1', name: 'Alice', avatar: 'https://picsum.photos/32/32?random=1' },
  { id: '2', name: 'Bob', avatar: 'https://picsum.photos/32/32?random=2' },
  { id: '3', name: 'Charlie', avatar: 'https://picsum.photos/32/32?random=3' },
];

const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Design Homepage Mockup',
    status: TaskStatus.TODO,
    assignees: [mockUsers[0]],
    dueDate: 'Tomorrow',
    priority: 'High',
    tag: 'Design',
    sprint: 'Sprint 24',
  },
  {
    id: 't2',
    title: 'Integrate API Endpoints',
    status: TaskStatus.IN_PROGRESS,
    assignees: [mockUsers[1], mockUsers[2]],
    dueDate: 'Oct 24',
    priority: 'Medium',
    tag: 'Backend',
    sprint: 'Sprint 24',
  },
  {
    id: 't3',
    title: 'Write Documentation',
    status: TaskStatus.TODO,
    assignees: [mockUsers[2]],
    dueDate: 'Next Week',
    priority: 'Low',
    tag: 'Docs',
    sprint: 'Sprint 24',
  },
  {
    id: 't4',
    title: 'Fix Navigation Bug',
    status: TaskStatus.REVIEW,
    assignees: [mockUsers[0]],
    dueDate: 'Today',
    priority: 'High',
    tag: 'Bug',
    sprint: 'Sprint 24',
  },
  {
    id: 't5',
    title: 'Setup CI/CD Pipeline',
    status: TaskStatus.DONE,
    assignees: [mockUsers[1]],
    dueDate: 'Oct 20',
    priority: 'Medium',
    tag: 'DevOps',
    sprint: 'Sprint 24',
  },
];

const KanbanBoard: React.FC = () => {
  const columns = [
    { id: TaskStatus.TODO, title: 'To Do', color: 'bg-slate-100 border-t-4 border-slate-400' },
    {
      id: TaskStatus.IN_PROGRESS,
      title: 'In Progress',
      color: 'bg-blue-50 border-t-4 border-blue-500',
    },
    { id: TaskStatus.REVIEW, title: 'Review', color: 'bg-purple-50 border-t-4 border-purple-500' },
    { id: TaskStatus.DONE, title: 'Done', color: 'bg-green-50 border-t-4 border-green-500' },
  ];

  return (
    <div className="h-full flex-1 overflow-x-auto overflow-y-hidden bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sprint 24 Board</h2>
          <p className="mt-1 text-sm text-slate-500">Project Alpha • Software Development</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {mockUsers.map((u) => (
              <img
                key={u.id}
                src={u.avatar}
                alt={u.name}
                className="h-8 w-8 rounded-full border-2 border-white"
              />
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-medium text-slate-500">
              +2
            </div>
          </div>
          <button className="flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
            <Plus size={16} /> New Issue
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100%-80px)] gap-6 pb-4">
        {columns.map((col) => {
          const tasks = mockTasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="flex h-full w-80 shrink-0 flex-col rounded-lg border border-slate-200 bg-slate-50/80"
            >
              <div
                className={cn(
                  'flex items-center justify-between rounded-t-lg border-t-4 bg-white p-3 shadow-sm',
                  col.color.split(' ').slice(1).join(' '),
                )}
              >
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  {col.title}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    {tasks.length}
                  </span>
                </h3>
                <button className="cursor-pointer text-slate-400 hover:text-slate-600">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="group cursor-pointer rounded-md border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <span
                        className={cn(
                          'rounded px-2 py-1 text-xs font-medium',
                          task.priority === 'High'
                            ? 'bg-red-50 text-red-600'
                            : task.priority === 'Medium'
                              ? 'bg-orange-50 text-orange-600'
                              : 'bg-blue-50 text-blue-600',
                        )}
                      >
                        {task.tag}
                      </span>
                      <button className="cursor-pointer text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-500">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                    <h4 className="mb-3 text-sm leading-tight font-medium text-slate-800">
                      {task.title}
                    </h4>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {task.dueDate === 'Today' || task.dueDate === 'Tomorrow' ? (
                          <span className="flex items-center gap-1 font-medium text-red-500">
                            <Calendar size={12} /> {task.dueDate}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {task.dueDate}
                          </span>
                        )}
                      </div>
                      <div className="flex -space-x-1">
                        {task.assignees.map((u) => (
                          <img
                            key={u.id}
                            src={u.avatar}
                            alt={u.name}
                            className="h-6 w-6 rounded-full border border-white"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3 border-t border-slate-50 pt-3 text-slate-400">
                      <div className="flex items-center gap-1 text-xs">
                        <MessageSquare size={12} /> 2
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Paperclip size={12} /> 1
                      </div>
                    </div>
                  </div>
                ))}

                <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-slate-300 py-2 text-sm text-slate-500 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600">
                  <Plus size={14} /> Create Task
                </button>
              </div>
            </div>
          );
        })}

        {/* "Blank Board" placeholder/add column */}
        <div className="flex h-full w-80 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-600">
          <div className="text-center">
            <Plus size={32} className="mx-auto mb-2" />
            <span className="font-medium">Add Section</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;

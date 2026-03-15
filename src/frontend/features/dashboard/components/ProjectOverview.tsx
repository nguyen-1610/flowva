'use client';

import React from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { TrendingUp, Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/frontend/lib/utils';
import { getMockAvatar } from '@/frontend/lib/avatar-utils';
import { useTasks } from '@/frontend/features/tasks/hooks/useTasks';

import { CurrentUser } from '@/shared/types/auth';

interface ProjectOverviewProps {
  user?: CurrentUser;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ user }) => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');
  const { tasks, isLoading } = useTasks(projectId);

  // Calculate real stats from fetched tasks
  const stats = [
    {
      label: 'Total Tasks',
      value: tasks?.length.toString() || '0',
      icon: CheckCircle,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'In Progress',
      value: tasks?.filter(t => t.column_id === 'IN_PROGRESS').length.toString() || '0',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    { 
      label: 'Urgent', 
      value: tasks?.filter(t => t.priority === 'High' || t.priority === 'HIGH').length.toString() || '0', 
      icon: AlertCircle, 
      color: 'text-red-600', 
      bg: 'bg-red-100' 
    },
    { 
      label: 'Team Members', 
      value: '1', // Default for now as we don't fetch members here yet
      icon: Users, 
      color: 'text-green-600', 
      bg: 'bg-green-100' 
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-white p-8">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="h-full flex-1 overflow-y-auto bg-white p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">
          Good Morning, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-sm text-slate-500">
          Here is what&apos;s happening with your project today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={cn(stat.bg, 'rounded-lg p-2.5')}>
                <Icon size={20} className={stat.color} />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800 leading-none">{stat.value}</div>
                <h3 className="text-xs font-medium text-slate-500 mt-1">{stat.label}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 lg:col-span-2">
          <h2 className="mb-4 text-base font-bold text-slate-800">Recent Activity</h2>
          <div className="space-y-3">
            {tasks && tasks.length > 0 ? (
              tasks.slice(0, 4).map((task, i) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 border-b border-slate-200/60 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-[10px]">
                    {user?.name.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-800 leading-tight">
                      <span className="font-semibold">{user?.name || 'You'}</span> updated task{' '}
                      <span className="font-medium text-indigo-600 truncate inline-block max-w-[200px] align-bottom">{task.title}</span>
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {new Date(task.updated_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-2">No recent activity found.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl bg-linear-to-br from-indigo-600 to-purple-700 p-5 text-white shadow-lg">
          <h2 className="mb-2 text-base font-bold">Project Status</h2>
          {tasks && tasks.length > 0 ? (
            <>
              <div className="mb-4 h-1.5 w-full rounded-full bg-white/20">
                <div 
                  className="h-1.5 rounded-full bg-white transition-all duration-1000" 
                  style={{ width: `${Math.round((tasks.filter(t => t.column_id === 'DONE').length / tasks.length) * 100)}%` }}
                ></div>
              </div>
              <p className="mb-4 text-xs text-indigo-100 leading-relaxed">
                {Math.round((tasks.filter(t => t.column_id === 'DONE').length / tasks.length) * 100)}% of tasks completed.
              </p>
            </>
          ) : (
             <p className="mb-4 text-xs text-indigo-100">No tasks found in this project.</p>
          )}
          <button className="w-full cursor-pointer rounded-lg bg-white py-2 text-sm font-bold text-indigo-700 transition-colors hover:bg-indigo-50 active:scale-[0.98]">
            View Details
          </button>
        </div>
      </div>
    </div>
  );

};

export default ProjectOverview;

'use client';

import React from 'react';
import Image from 'next/image';
import { TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/frontend/lib/utils';
import { getMockAvatar } from '@/frontend/lib/avatar-utils';

import { CurrentUser } from '@/shared/types/auth';

interface ProjectOverviewProps {
  user?: CurrentUser;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ user }) => {
  const stats = [
    {
      label: 'Total Tasks',
      value: '42',
      icon: CheckCircle,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'In Progress',
      value: '12',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    { label: 'Urgent', value: '3', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Team Members', value: '8', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="h-full flex-1 overflow-y-auto bg-white p-8">
      <h1 className="mb-2 text-3xl font-bold text-slate-800">
        Good Morning, {user?.name || 'User'}! 👋
      </h1>
      <p className="mb-8 text-slate-500">Here is what&apos;s happening with Project Alpha today.</p>

      {/* Stats Grid */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={cn(stat.bg, 'rounded-lg p-3')}>
                  <Icon size={24} className={stat.color} />
                </div>
                <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-500">{stat.label}</h3>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-slate-800">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 border-b border-slate-200 pb-4 last:border-0 last:pb-0"
              >
                <Image
                  src={getMockAvatar(i)}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <p className="text-sm text-slate-800">
                    <span className="font-semibold">User {i}</span> moved task{' '}
                    <span className="font-medium text-indigo-600">Update API Docs</span> to{' '}
                    <span className="italic">In Progress</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-linear-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-lg">
          <h2 className="mb-2 text-xl font-bold">Project Status</h2>
          <div className="mb-6 h-2 w-full rounded-full bg-white/20">
            <div className="h-2 w-[75%] rounded-full bg-white"></div>
          </div>
          <p className="mb-6 text-sm text-indigo-100">
            75% of tasks completed for the upcoming Sprint release.
          </p>
          <button className="w-full cursor-pointer rounded-lg bg-white py-2 font-semibold text-indigo-700 transition-colors hover:bg-indigo-50">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;

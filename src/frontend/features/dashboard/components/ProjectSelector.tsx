'use client';

import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { cn } from '@/frontend/lib/utils';

interface ProjectSelectorProps {
  onSelectProject: () => void;
  userName?: string;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  onSelectProject,
  userName = 'Bạn',
}) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 p-6">
      {/* Header / Nav simulation */}
      <div className="absolute top-0 left-0 flex w-full items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
            F
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Flowva</span>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 mb-12 w-full max-w-4xl text-center duration-700">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
          Welcome back,{' '}
          <span className="relative inline-block text-indigo-600">
            {userName}.
            <svg
              className="absolute -bottom-1 left-0 h-3 w-full text-yellow-400 opacity-80"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </span>
        </h1>
        <p className="text-xl font-medium text-slate-500">Pick up where you left off in Flowva</p>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl delay-100 duration-700">
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-wider text-slate-700 uppercase">
              Your Recent Projects
            </h2>
            <button className="cursor-pointer text-sm font-semibold text-indigo-600 hover:underline">
              Create a new site
            </button>
          </div>

          <div className="space-y-4">
            {/* Project Card */}
            <div
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-indigo-300 hover:bg-white hover:shadow-md"
              onClick={onSelectProject}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm transition-transform group-hover:scale-110">
                  <span className="text-lg font-bold">PA</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
                    Project Alpha
                  </h3>
                  <p className="text-sm text-slate-500">Software Development • jira.flowva.com</p>
                </div>
              </div>

              <button className="flex transform cursor-pointer items-center gap-2 rounded-lg bg-amber-400 px-6 py-2 font-bold text-slate-900 transition-colors duration-200 group-hover:translate-x-1 hover:bg-amber-500">
                Go to Project <ArrowRight size={16} />
              </button>
            </div>

            {/* Secondary Project (Disabled/Mock) */}
            <div className="group flex cursor-not-allowed items-center justify-between rounded-xl border border-slate-100 p-4 opacity-60 transition-all hover:border-slate-300">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500 text-white shadow-sm">
                  <span className="text-lg font-bold">MK</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-800">Marketing Q4</h3>
                  <p className="text-sm text-slate-500">Marketing • marketing.flowva.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-8 py-4">
          <div className="flex gap-4">
            <span className="flex items-center gap-1 text-sm text-slate-400">
              <Layers size={14} /> 5 Projects
            </span>
          </div>
          <button className="cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-800">
            Explore features
          </button>
        </div>
      </div>

      {/* Decorative doodles */}
      <div className="pointer-events-none absolute right-10 bottom-10 opacity-20">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <path d="M40,160 Q 100,10 160,160" stroke="#4f46e5" strokeWidth="4" fill="none" />
          <circle cx="20" cy="40" r="10" fill="#fbbf24" />
          <rect
            x="150"
            y="20"
            width="20"
            height="20"
            fill="#ec4899"
            transform="rotate(20 160 30)"
          />
        </svg>
      </div>
    </div>
  );
};

export default ProjectSelector;

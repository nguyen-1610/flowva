'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout, Kanban, ListTodo, Users, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { cn } from '@/frontend/lib/utils';
import { ViewType } from '@/shared/types/ui-types';
import { CurrentUser } from '@/shared/types/auth';

export type DashboardTab = 'overview' | 'backlog' | 'board' | 'members';

const Sidebar: React.FC<{ user?: CurrentUser }> = ({ user }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { href: '/dashboard', label: 'Overview', icon: Layout },
    { href: '/dashboard/backlog', label: 'Backlog', icon: ListTodo },
    { href: '/dashboard/board', label: 'Board', icon: Kanban },
    { href: '/dashboard/members', label: 'Members', icon: Users },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div
      className={cn(
        'relative flex h-full shrink-0 flex-col border-r border-slate-200 bg-slate-50 transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64',
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 -right-3 z-50 cursor-pointer rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow-sm hover:bg-slate-100"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Project Title (Small Header) */}
      <div
        className={cn('border-b border-slate-200/50 p-4', isCollapsed ? 'flex justify-center' : '')}
      >
        {!isCollapsed ? (
          <div>
            <h3 className="mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
              Project
            </h3>
            <h2 className="truncate text-sm font-bold text-slate-800">Project Alpha</h2>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600">
            PA
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : ''}
              className={cn(
                'flex w-full cursor-pointer items-center rounded-lg py-2.5 text-sm font-medium transition-all',
                isCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
                active
                  ? 'border border-slate-100 bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800',
              )}
            >
              <Icon size={18} className={active ? 'text-indigo-600' : 'text-slate-400'} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer / Settings */}
      <div className="border-t border-slate-200 p-3">
        <button
          className={cn(
            'flex w-full cursor-pointer items-center rounded-lg py-2 text-sm font-medium text-slate-500 transition-all hover:bg-slate-200/50 hover:text-slate-800',
            isCollapsed ? 'justify-center' : 'gap-3 px-3',
          )}
        >
          <Settings size={18} />
          {!isCollapsed && <span>Project Settings</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

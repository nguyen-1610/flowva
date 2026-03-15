'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { getMockAvatar } from '@/frontend/lib/avatar-utils';
import {
  Layout,
  Kanban,
  Calendar,
  MessageSquare,
  Settings,
  Plus,
  ChevronDown,
  Layers,
  ChevronLeft,
  ChevronRight,
  ListTodo,
  LogOut,
  Loader2,
  Users,
} from 'lucide-react';
import { ViewType } from '@/shared/types/ui-types';
import { logout } from '@/frontend/features/auth/actions';
import { cn } from '@/frontend/lib/utils';

import { CurrentUser } from '@/shared/types/auth';

interface SidebarProps {
  user: CurrentUser;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', icon: Layout, label: 'Overview' },
    { href: '/dashboard/backlog', icon: ListTodo, label: 'Backlog' },
    { href: '/dashboard/board', icon: Kanban, label: 'Board' },
    { href: '/dashboard/members', icon: Users, label: 'Members' },
    { href: '/calendar', icon: Calendar, label: 'Calendar' },
    { href: '/chat', icon: MessageSquare, label: 'Team Chat' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <div
      className={cn(
        'relative top-0 z-20 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-slate-50 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute top-5 -right-3 z-50 cursor-pointer rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow-sm hover:bg-slate-100"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Project Selector (Jira style) - Now at the Top */}
      <div className={cn('py-4', isCollapsed ? 'px-1.5' : 'px-3')}>
        <div
          className={cn(
            'group relative flex cursor-pointer items-center rounded-md py-1.5 transition-colors hover:bg-slate-200',
            isCollapsed ? 'justify-center' : 'justify-between px-2'
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-blue-100 text-blue-600">
              <Layers size={16} />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="w-28 truncate text-sm font-bold text-slate-700">Project Alpha</p>
                <p className="truncate text-[10px] text-slate-500">Software Dev</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600" />
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="scrollbar-hide flex-1 overflow-y-auto px-2 py-2">
        {!isCollapsed && (
          <div className="mb-1.5 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase transition-opacity">
            Planning
          </div>
        )}
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : ''}
                className={cn(
                  'flex w-full items-center rounded-md py-2 text-sm font-medium transition-all',
                  isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-3',
                  active
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                )}
              >
                <Icon
                  size={16}
                  className={active ? 'text-blue-600' : 'text-slate-500'}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {!isCollapsed ? (
          <>
            <div className="mt-6 mb-1.5 flex items-center justify-between px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <span>Your Teams</span>
              <Plus size={12} aria-label="Add team" className="cursor-pointer hover:text-slate-600" />
            </div>
            <div className="space-y-0.5">
              <button className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                Marketing Team
              </button>
              <button className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                Design Crew
              </button>
            </div>
          </>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-2.5">
            <div className="mb-1 h-px w-8 border-t border-slate-200"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" title="Marketing Team"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-purple-500" title="Design Crew"></div>
            <div 
              aria-label="Add team"
              className="mt-0.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200"
            >
              <Plus size={10} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div
        className={cn('border-t border-slate-200 p-3', isCollapsed ? 'flex flex-col items-center' : '')}
      >
        <Link
          href="/dashboard/settings"
          title="Settings"
          className={cn(
            'flex w-full items-center rounded-md py-1.5 text-sm font-medium transition-all',
            isCollapsed ? 'justify-center' : 'gap-2.5 px-3',
            isActive('/dashboard/settings')
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-600 hover:bg-slate-200'
          )}
        >
          <Settings size={16} />
          {!isCollapsed && <span>Settings</span>}
        </Link>

        {/* User Dropdown */}
        <div className="relative mt-2 w-full">
          {isDropdownOpen && (
            <div
              className={cn(
                'absolute bottom-full mb-2 w-full min-w-40 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg',
                isCollapsed ? 'left-1/2 -translate-x-1/2' : ''
              )}
            >
               <div className="mb-1.5 border-b border-slate-100 px-2.5 py-1.5">
                <p className="truncate text-xs font-bold text-slate-800">{user.name}</p>
                <p className="truncate text-[10px] text-slate-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                disabled={isPending}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                {isPending ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
                <span>{isPending ? 'Logging out...' : 'Log Out'}</span>
              </button>
            </div>
          )}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            className={cn(
              'flex w-full cursor-pointer items-center rounded-md p-1.5 text-left transition-colors hover:bg-slate-200',
              isCollapsed ? 'justify-center' : ''
            )}
          >
            <Image
              src={user.avatar || getMockAvatar(user.name)}
              alt={user.name}
              width={24}
              height={24}
              className="h-6 w-6 shrink-0 rounded-full border border-white shadow-sm"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1 pl-2">
                <p className="truncate text-xs font-bold text-slate-700">{user.name}</p>
                <p className="truncate text-[10px] text-slate-500">Online</p>
              </div>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;


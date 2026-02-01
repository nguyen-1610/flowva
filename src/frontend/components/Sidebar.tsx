'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
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
} from 'lucide-react';
import { ViewType, User } from '@/shared/types/ui-types';
import { logout } from '@/frontend/features/auth/actions';

interface SidebarProps {
  currentView?: ViewType | string;
  onChangeView?: (view: ViewType) => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Map ViewType to routes
  const getRouteForView = (view: ViewType): string => {
    switch (view) {
      case ViewType.DASHBOARD:
        return '/dashboard';
      case ViewType.BACKLOG:
        return '/dashboard/tasks?view=backlog';
      case ViewType.KANBAN:
        return '/dashboard/tasks';
      case ViewType.CALENDAR:
        return '/dashboard/calendar';
      case ViewType.CHAT:
        return '/dashboard/chat';
      case ViewType.SETTINGS:
        return '/dashboard/settings';
      default:
        return '/dashboard';
    }
  };

  // Determine current view from pathname
  const getCurrentViewFromPath = (): ViewType => {
    if (pathname === '/dashboard') return ViewType.DASHBOARD;
    if (pathname === '/dashboard/tasks') {
      // Check query params for backlog
      return searchParams.get('view') === 'backlog' ? ViewType.BACKLOG : ViewType.KANBAN;
    }
    if (pathname === '/dashboard/calendar') return ViewType.CALENDAR;
    if (pathname === '/dashboard/chat') return ViewType.CHAT;
    if (pathname === '/dashboard/settings') return ViewType.SETTINGS;
    return ViewType.DASHBOARD;
  };

  const activeView = currentView || getCurrentViewFromPath();

  const handleViewChange = (view: ViewType) => {
    if (onChangeView) {
      onChangeView(view);
    } else {
      router.push(getRouteForView(view));
    }
  };

  const menuItems = [
    { id: ViewType.DASHBOARD, icon: Layout, label: 'Overview' },
    { id: ViewType.BACKLOG, icon: ListTodo, label: 'Backlog' },
    { id: ViewType.KANBAN, icon: Kanban, label: 'Board' },
    { id: ViewType.CALENDAR, icon: Calendar, label: 'Calendar' },
    { id: ViewType.CHAT, icon: MessageSquare, label: 'Team Chat' },
  ];

  const handleLogout = async () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <div
      className={`${isCollapsed ? 'w-20' : 'w-64'} relative top-0 z-20 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-slate-50 transition-all duration-300`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-20 -right-3 z-50 rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow-sm hover:bg-slate-100"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* App Header */}
      <div
        className={`flex h-16 items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-slate-200 transition-all duration-300`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
            F
          </div>
          <span
            className={`text-xl font-bold tracking-tight whitespace-nowrap text-slate-800 transition-opacity duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'opacity-100'}`}
          >
            Flowva
          </span>
        </div>
      </div>

      {/* Project Selector (Jira style) */}
      <div className={`py-4 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <div
          className={`group relative flex cursor-pointer items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'} rounded-md py-2 transition-colors hover:bg-slate-200`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-100 text-blue-600">
              <Layers size={18} />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="w-32 truncate text-sm font-semibold text-slate-700">Project Alpha</p>
                <p className="truncate text-xs text-slate-500">Software Dev</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600" />
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="scrollbar-hide flex-1 overflow-y-auto px-3 py-2">
        {!isCollapsed && (
          <div className="mb-2 px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase transition-opacity">
            Planning
          </div>
        )}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                title={isCollapsed ? item.label : ''}
                className={`flex w-full items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} rounded-md py-2.5 text-sm font-medium transition-all ${
                  activeView === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon
                  size={18}
                  className={activeView === item.id ? 'text-blue-600' : 'text-slate-500'}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {!isCollapsed ? (
          <>
            <div className="mt-8 mb-2 flex items-center justify-between px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              <span>Your Teams</span>
              <Plus size={14} className="cursor-pointer hover:text-slate-600" />
            </div>
            <div className="space-y-1">
              <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-200">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                Marketing Team
              </button>
              <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-200">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                Design Crew
              </button>
            </div>
          </>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="mb-2 h-1 w-10 border-t border-slate-200"></div>
            <div className="h-2 w-2 rounded-full bg-green-500" title="Marketing Team"></div>
            <div className="h-2 w-2 rounded-full bg-purple-500" title="Design Crew"></div>
            <div className="mt-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200">
              <Plus size={12} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div
        className={`border-t border-slate-200 p-4 ${isCollapsed ? 'flex flex-col items-center' : ''}`}
      >
        <button
          onClick={() => handleViewChange(ViewType.SETTINGS)}
          title="Settings"
          className={`flex w-full items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} rounded-md py-2 text-sm font-medium ${
            activeView === ViewType.SETTINGS
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Settings size={18} />
          {!isCollapsed && <span>Settings</span>}
        </button>

        {/* User Dropdown */}
        <div className="relative mt-4 w-full">
          {isDropdownOpen && (
            <div
              className={`absolute bottom-full mb-2 w-full rounded-lg border border-slate-200 bg-white p-2 shadow-lg ${isCollapsed ? 'left-1/2 -translate-x-1/2' : ''}`}
            >
              <button
                onClick={handleLogout}
                disabled={isPending}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                {!isCollapsed && <span>{isPending ? 'Logging out...' : 'Log Out'}</span>}
              </button>
            </div>
          )}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex w-full items-center rounded-md p-2 text-left transition-colors hover:bg-slate-200 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <img
              src={user.avatar || 'https://picsum.photos/100/100'}
              alt={user.name}
              className="h-8 w-8 shrink-0 rounded-full border border-white shadow-sm"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1 pl-3">
                <p className="truncate text-sm font-medium text-slate-700">{user.name}</p>
                <p className="truncate text-xs text-slate-500">Online</p>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

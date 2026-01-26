'use client';

import React, { useState } from 'react';
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
  ListTodo
} from 'lucide-react';
import { ViewType } from '@/shared/types/ui';

interface SidebarProps {
  currentView?: ViewType | string;
  onChangeView?: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  return (
    <div 
      className={`${isCollapsed ? 'w-20' : 'w-64'} bg-slate-50 border-r border-slate-200 h-screen flex flex-col flex-shrink-0 sticky top-0 transition-all duration-300 relative z-20`}
    >
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-100 text-slate-500 z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* App Header */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-slate-200 transition-all duration-300`}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 flex-shrink-0 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className={`text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            Flowva
          </span>
        </div>
      </div>

      {/* Project Selector (Jira style) */}
      <div className={`py-4 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'} py-2 rounded-md hover:bg-slate-200 cursor-pointer transition-colors group relative`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center flex-shrink-0">
              <Layers size={18} />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-700 truncate w-32">Project Alpha</p>
                <p className="text-xs text-slate-500 truncate">Software Dev</p>
              </div>
            )}
          </div>
          {!isCollapsed && <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600" />}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
        {!isCollapsed && (
          <div className="mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 transition-opacity">
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
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-md text-sm font-medium transition-all ${
                  activeView === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon size={18} className={activeView === item.id ? 'text-blue-600' : 'text-slate-500'} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {!isCollapsed ? (
          <>
            <div className="mt-8 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 flex justify-between items-center">
              <span>Your Teams</span>
              <Plus size={14} className="cursor-pointer hover:text-slate-600" />
            </div>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-slate-200">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Marketing Team
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-slate-200">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                Design Crew
              </button>
            </div>
          </>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-3">
             <div className="w-10 h-1 border-t border-slate-200 mb-2"></div>
             <div className="w-2 h-2 rounded-full bg-green-500" title="Marketing Team"></div>
             <div className="w-2 h-2 rounded-full bg-purple-500" title="Design Crew"></div>
             <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 cursor-pointer mt-1">
               <Plus size={12} />
             </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className={`p-4 border-t border-slate-200 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        <button 
          onClick={() => handleViewChange(ViewType.SETTINGS)}
          title="Settings"
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2 rounded-md text-sm font-medium ${
            activeView === ViewType.SETTINGS ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Settings size={18} />
          {!isCollapsed && <span>Settings</span>}
        </button>
        <div className={`mt-4 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'}`}>
          <img src="https://picsum.photos/100/100" alt="User" className="w-8 h-8 rounded-full border border-white shadow-sm" />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">Alex Designer</p>
              <p className="text-xs text-slate-500 truncate">Online</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

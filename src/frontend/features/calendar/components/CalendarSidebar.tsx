'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  LayoutList,
  Columns,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckSquare,
  Square,
} from 'lucide-react';
import { cn } from '@/frontend/lib/utils';

interface CalendarSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  filters: { meetings: boolean; reviews: boolean; deadlines: boolean; freeTime: boolean };
  onToggleFilter: (key: any) => void;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  currentView,
  onViewChange,
  filters,
  onToggleFilter,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [calendarScope, setCalendarScope] = useState('Project Calendar');

  const views = [
    { id: 'month', label: 'Month View', icon: CalendarIcon },
    { id: 'week', label: 'Week View', icon: Columns }, // closely resembles vertical bars
    { id: 'day', label: 'Day View', icon: LayoutList },
    { id: 'schedule', label: 'Schedule', icon: Clock },
  ];

  // Mini Calendar Mock Data
  const miniDates = Array.from({ length: 35 }, (_, i) => i + 1);

  return (
    <div
      className={cn(
        'relative flex h-full flex-shrink-0 flex-col border-r border-slate-200 bg-slate-50 transition-all duration-300',
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

      {/* 1. Calendar Scope Dropdown */}
      <div
        className={cn('border-b border-slate-200/50 p-4', isCollapsed ? 'flex justify-center' : '')}
      >
        {!isCollapsed ? (
          <div className="group relative">
            <button className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow-sm transition-all hover:border-slate-300">
              {calendarScope}
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {/* Mock Dropdown */}
            <div className="absolute top-full left-0 z-50 mt-1 hidden w-full rounded-lg border border-slate-200 bg-white shadow-lg group-hover:block">
              {['Project Calendar', 'Team Calendar', 'Personal Calendar'].map((scope) => (
                <div
                  key={scope}
                  onClick={() => setCalendarScope(scope)}
                  className="cursor-pointer px-3 py-2 text-sm text-slate-600 first:rounded-t-lg last:rounded-b-lg hover:bg-indigo-50 hover:text-indigo-600"
                >
                  {scope}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600"
            title={calendarScope}
          >
            <CalendarIcon size={20} />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
        {/* 2. Calendar Views */}
        <div>
          {!isCollapsed && (
            <h3 className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
              Calendar Views
            </h3>
          )}
          <div className="space-y-1">
            {views.map((view) => {
              const Icon = view.icon;
              const isActive = currentView === view.id;
              return (
                <button
                  key={view.id}
                  onClick={() => onViewChange(view.id)}
                  title={isCollapsed ? view.label : ''}
                  className={cn(
                    'flex w-full cursor-pointer items-center rounded-lg py-2.5 text-sm font-medium transition-all',
                    isCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
                    isActive
                      ? 'bg-purple-50 font-semibold text-purple-700'
                      : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800',
                  )}
                >
                  <Icon size={18} className={isActive ? 'text-purple-600' : 'text-slate-400'} />
                  {!isCollapsed && <span>{view.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Mini Calendar */}
        {!isCollapsed && (
          <div>
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-800">October 2023</h3>
              <div className="flex gap-1">
                <ChevronLeft
                  size={14}
                  className="cursor-pointer text-slate-400 hover:text-slate-600"
                />
                <ChevronRight
                  size={14}
                  className="cursor-pointer text-slate-400 hover:text-slate-600"
                />
              </div>
            </div>
            <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-medium text-slate-400">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                <div key={idx}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center text-xs text-slate-600">
              {miniDates.map((d, i) => {
                // Just a visual approximation
                const day = i > 3 && i <= 34 ? i - 3 : '';
                const isSelected = day === 24;
                // const isToday = day === 24; // Mock
                return (
                  <div
                    key={i}
                    className={cn(
                      'mx-auto flex h-6 w-6 cursor-pointer items-center justify-center rounded-full hover:bg-slate-100',
                      isSelected ? 'bg-purple-600 text-white hover:bg-purple-700' : '',
                    )}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Event Filters */}
        {!isCollapsed && (
          <div>
            <h3 className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
              Event Filters
            </h3>
            <div className="space-y-2">
              {[
                { id: 'meetings', label: 'Meetings', color: 'text-purple-500' },
                { id: 'reviews', label: 'Reviews', color: 'text-blue-500' },
                { id: 'deadlines', label: 'Deadlines', color: 'text-red-500' },
                { id: 'freeTime', label: 'Free Time', color: 'text-slate-400' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleFilter(item.id)}
                  className="group flex cursor-pointer items-center gap-3 px-1"
                >
                  {filters[item.id as keyof typeof filters] ? (
                    <CheckSquare size={16} className={`${item.color}`} />
                  ) : (
                    <Square size={16} className="text-slate-300" />
                  )}
                  <span className="text-sm text-slate-600 group-hover:text-slate-900">
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      'ml-auto h-2 w-2 rounded-full',
                      item.color.replace('text-', 'bg-'),
                    )}
                  ></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Critical Milestones */}
        {!isCollapsed && (
          <div>
            <h3 className="mb-3 text-xs font-bold tracking-wider text-red-400 uppercase">
              Critical Milestones
            </h3>
            <div className="space-y-3">
              <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                <h4 className="text-sm font-bold text-red-700">Sprint 42 Release</h4>
                <p className="mt-1 text-xs text-red-500">Oct 12 • 4 days left</p>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                <h4 className="text-sm font-bold text-blue-700">Security Audit</h4>
                <p className="mt-1 text-xs text-blue-500">Oct 20 • 12 days left</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarSidebar;

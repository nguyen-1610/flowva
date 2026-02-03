'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Clock, Video, Plus, Info } from 'lucide-react';
import CalendarSidebar from './CalendarSidebar';
import { cn } from '@/frontend/lib/utils';
import { getMockAvatar } from '@/frontend/lib/avatar-utils';

const CalendarView: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 35 }, (_, i) => i + 1); // Mock dates for grid

  // View State
  const [currentView, setCurrentView] = useState('month');

  // Filters State
  const [filters, setFilters] = useState({
    deadlines: true,
    meetings: true,
    reviews: true,
    freeTime: false,
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Mock events
  const events = [
    {
      id: 1,
      day: 24,
      title: 'Team Sync',
      type: 'meeting',
      time: '10:00 AM',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
    }, // Changed to purple to match sidebar meeting color
    {
      id: 2,
      day: 24,
      title: 'Release v2.0',
      type: 'deadline',
      time: '5:00 PM',
      color: 'bg-red-100 text-red-700 border-red-200',
    },
    {
      id: 3,
      day: 26,
      title: 'Client Demo',
      type: 'meeting',
      time: '2:00 PM',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
    },
    {
      id: 4,
      day: 28,
      title: 'Code Freeze',
      type: 'deadline',
      time: 'End of Day',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    {
      id: 5,
      day: 15,
      title: 'Design Review',
      type: 'reviews',
      time: '11:00 AM',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    {
      id: 6,
      day: 6,
      title: 'Sprint Standup',
      type: 'meeting',
      time: '9:00 AM',
      color: 'bg-purple-600 text-white border-purple-600',
    },
    {
      id: 7,
      day: 6,
      title: 'All-Hands Meeting',
      type: 'meeting',
      time: '2:00 PM',
      color: 'bg-purple-500 text-white border-purple-500',
    },
    {
      id: 8,
      day: 12,
      title: 'Sprint Release',
      type: 'deadline',
      time: '5:00 PM',
      color: 'bg-red-500 text-white border-red-500',
    },
  ];

  const filteredEvents = events.filter((evt) => {
    if (evt.type === 'meeting' && !filters.meetings) return false;
    if (evt.type === 'deadline' && !filters.deadlines) return false;
    if (evt.type === 'reviews' && !filters.reviews) return false;
    return true;
  });

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-50">
      <CalendarSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        filters={filters}
        onToggleFilter={toggleFilter}
      />

      <div className="relative -mt-px -ml-px flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-tl-2xl border-t border-l border-slate-200 bg-white p-6 shadow-sm">
        {/* Main Content Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Team Workspace</span>
            <ChevronRight size={14} />
            <span className="font-bold text-slate-800">Calendar</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex rounded-lg bg-slate-100 p-1">
              {['Month', 'Week', 'Day', 'Today'].map((v) => (
                <button
                  key={v}
                  className={cn(
                    'cursor-pointer rounded-md px-4 py-1.5 text-xs font-medium transition-all',
                    v.toLowerCase() === currentView || (v === 'Today' && false) // Just mock active state for now or link strictly
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700',
                  )}
                  onClick={() => v !== 'Today' && setCurrentView(v.toLowerCase())}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-800">October 2023</h2>
            <div className="flex gap-1">
              <button className="cursor-pointer rounded-full p-1 text-slate-500 hover:bg-slate-100">
                <ChevronLeft size={20} />
              </button>
              <button className="cursor-pointer rounded-full p-1 text-slate-500 hover:bg-slate-100">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Info size={14} /> All times in GMT+1
            </div>
            <button className="flex cursor-pointer items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-purple-700">
              <Plus size={16} /> Create Event
            </button>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <Image
                  key={i}
                  src={getMockAvatar(i + 10)}
                  alt="Team member"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border-2 border-white"
                />
              ))}
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-purple-100 text-xs font-bold text-purple-600">
                +5
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
            {days.map((day) => (
              <div
                key={day}
                className="py-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid flex-1 auto-rows-fr grid-cols-7 bg-white">
            {dates.map((date, idx) => {
              // Mock offset to start on a Tuesday (index 2)
              const startOffset = 2;
              const displayDate =
                idx >= startOffset && idx < 31 + startOffset ? idx - startOffset + 1 : '';
              const currentEvents = filteredEvents.filter((e) => e.day === displayDate);
              const isWeekend = idx % 7 === 0 || idx % 7 === 6;

              return (
                <div
                  key={idx}
                  className={cn(
                    'group relative min-h-25 border-r border-b border-slate-100 p-2 transition-colors hover:bg-slate-50',
                    idx % 7 === 0 ? 'border-l' : '',
                  )}
                >
                  {displayDate && (
                    <>
                      <div className="mb-1 flex items-start justify-between">
                        <span
                          className={cn(
                            'text-sm font-medium',
                            displayDate === 1 ? 'text-slate-400' : 'text-slate-400',
                          )}
                        >
                          {displayDate === 1 ? '1' : displayDate}
                        </span>
                        {displayDate === 24 && (
                          <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        )}
                      </div>

                      {filters.freeTime && !isWeekend && currentEvents.length === 0 && (
                        <div className="absolute inset-x-2 top-8 bottom-2 flex items-center justify-center rounded border border-dashed border-slate-200 bg-slate-50 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="text-[10px] text-slate-400">Deep Work (Free)</span>
                        </div>
                      )}

                      <div className="mt-2 space-y-1.5">
                        {currentEvents.map((evt) => (
                          <div
                            key={evt.id}
                            className={cn(
                              'flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1.5 text-[10px] font-semibold shadow-sm transition-opacity hover:opacity-90',
                              evt.color,
                            )}
                          >
                            {evt.type === 'meeting' && <Video size={10} />}
                            <span className="truncate">{evt.title}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Action Button (Mock from image) */}
        <div className="absolute right-8 bottom-8">
          <button className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-purple-600 text-white shadow-lg shadow-purple-200 transition-transform hover:scale-105">
            <Clock size={24} />
            <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-white"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

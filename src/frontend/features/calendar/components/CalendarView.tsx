'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Video, Filter, Check } from 'lucide-react';

const CalendarView: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 35 }, (_, i) => i + 1); // Mock dates for grid

  // Filters State
  const [filters, setFilters] = useState({
    deadlines: true,
    meetings: true,
    freeTime: false
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Mock events
  const events = [
    { id: 1, day: 24, title: 'Team Sync', type: 'meeting', time: '10:00 AM', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 2, day: 24, title: 'Release v2.0', type: 'deadline', time: '5:00 PM', color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 3, day: 26, title: 'Client Demo', type: 'meeting', time: '2:00 PM', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 4, day: 28, title: 'Code Freeze', type: 'deadline', time: 'End of Day', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 5, day: 15, title: 'Design Review', type: 'meeting', time: '11:00 AM', color: 'bg-green-100 text-green-700 border-green-200' },
  ];

  const filteredEvents = events.filter(evt => {
    if (evt.type === 'meeting' && !filters.meetings) return false;
    if (evt.type === 'deadline' && !filters.deadlines) return false;
    return true;
  });

  return (
    <div className="flex-1 h-full flex flex-col bg-white p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Team Calendar</h2>
           <p className="text-slate-500">October 2023</p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4">
                <div className="flex bg-slate-100 rounded-md p-1">
                    <button className="px-3 py-1 bg-white rounded shadow-sm text-xs font-semibold text-slate-700">Month</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700">Week</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700">Day</button>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-full border border-slate-200"><ChevronLeft size={16}/></button>
                    <button className="p-2 hover:bg-slate-100 rounded-full border border-slate-200"><ChevronRight size={16}/></button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <span className="text-xs font-semibold text-slate-400 px-2 flex items-center gap-1 uppercase tracking-wide">
                  <Filter size={12} /> Filters:
                </span>
                
                <button 
                  onClick={() => toggleFilter('deadlines')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${filters.deadlines ? 'bg-red-100 text-red-700' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                  {filters.deadlines && <Check size={12} />} Deadlines
                </button>
                
                <button 
                  onClick={() => toggleFilter('meetings')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${filters.meetings ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                   {filters.meetings && <Check size={12} />} Meetings
                </button>

                <button 
                  onClick={() => toggleFilter('freeTime')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${filters.freeTime ? 'bg-green-100 text-green-700' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                   {filters.freeTime && <Check size={12} />} Free Time
                </button>
            </div>
        </div>
      </div>

      <div className="flex-1 border border-slate-200 rounded-lg flex flex-col shadow-sm bg-white">
        {/* Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {days.map(day => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500 uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {dates.map((date, idx) => {
             // Mock offset to start on Tuesday (just visual)
             const displayDate = idx > 1 && idx <= 32 ? idx - 1 : ''; 
             const currentEvents = filteredEvents.filter(e => e.day === displayDate);
             const isWeekend = idx % 7 === 0 || idx % 7 === 6;

             return (
              <div key={idx} className={`border-b border-r border-slate-100 min-h-[100px] p-2 hover:bg-slate-50 transition-colors relative ${idx % 7 === 0 ? 'border-l' : ''}`}>
                {displayDate && (
                  <>
                    <div className={`text-right text-sm mb-2 ${displayDate === 24 ? 'font-bold text-indigo-600' : 'text-slate-400'}`}>
                        {displayDate === 24 ? <span className="bg-indigo-100 w-6 h-6 inline-flex items-center justify-center rounded-full">{displayDate}</span> : displayDate}
                    </div>
                    
                    {filters.freeTime && !isWeekend && currentEvents.length === 0 && (
                      <div className="absolute inset-x-2 bottom-2 top-8 bg-green-50/50 border border-green-100 rounded border-dashed flex items-center justify-center">
                          <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Available</span>
                      </div>
                    )}

                    <div className="space-y-1 relative z-10">
                        {currentEvents.map(evt => (
                            <div key={evt.id} className={`px-2 py-1.5 rounded text-xs border border-l-4 ${evt.color} cursor-pointer hover:opacity-80`}>
                                <div className="font-semibold truncate">{evt.title}</div>
                                <div className="flex items-center gap-1 opacity-75 mt-0.5">
                                    {evt.type === 'meeting' ? <Video size={10} /> : <Clock size={10} />}
                                    <span className="truncate">{evt.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

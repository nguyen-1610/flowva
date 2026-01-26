'use client';

import React from 'react';
import Sidebar from '@/frontend/components/Sidebar';
import CalendarView from '@/frontend/features/calendar/components/CalendarView';
import { ViewType } from '@/shared/types/ui';

export default function CalendarPage() {
  return (
    <div className="flex h-screen w-screen bg-slate-100 overflow-hidden">
      <Sidebar currentView={ViewType.CALENDAR} />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative shadow-xl">
        <CalendarView />
      </main>
    </div>
  );
}

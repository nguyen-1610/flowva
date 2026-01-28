'use client';

import React from 'react';
import Sidebar from '@/frontend/components/Sidebar';
import CalendarView from '@/frontend/features/calendar/components/CalendarView';
import { ViewType } from '@/shared/types/ui';

export default function CalendarPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      <Sidebar currentView={ViewType.CALENDAR} />
      <main className="relative flex h-full flex-1 flex-col overflow-hidden shadow-xl">
        <CalendarView />
      </main>
    </div>
  );
}

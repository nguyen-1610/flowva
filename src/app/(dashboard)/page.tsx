'use client';

import React from 'react';
import Sidebar from '@/frontend/components/Sidebar';
import Dashboard from '@/frontend/components/Dashboard';
import { ViewType } from '@/shared/types/ui';

export default function DashboardOverviewPage() {
  return (
    <div className="flex h-screen w-screen bg-slate-100 overflow-hidden">
      <Sidebar currentView={ViewType.DASHBOARD} />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative shadow-xl">
        <Dashboard />
      </main>
    </div>
  );
}

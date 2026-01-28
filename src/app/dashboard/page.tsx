import React from 'react';
import Sidebar from '@/frontend/components/Sidebar';
import Dashboard from '@/frontend/components/Dashboard';
import { ViewType } from '@/shared/types/ui';

// TODO: Replace with actual data fetching from database
async function getDashboardStats() {
  // Placeholder - will be replaced with actual Server Action
  return {
    totalTasks: 42,
    inProgress: 12,
    urgent: 3,
    teamMembers: 8,
  };
}

export default async function DashboardOverviewPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      <Sidebar currentView={ViewType.DASHBOARD} />
      <main className="relative flex h-full flex-1 flex-col overflow-hidden shadow-xl">
        <Dashboard stats={stats} />
      </main>
    </div>
  );
}

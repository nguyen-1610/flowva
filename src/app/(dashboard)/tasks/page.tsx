'use client';

import React from 'react';
import Sidebar from '@/frontend/components/Sidebar';
import KanbanBoard from '@/frontend/features/tasks/components/KanbanBoard';
import BacklogView from '@/frontend/features/tasks/components/BacklogView';
import { ViewType } from '@/shared/types/ui';
import { useSearchParams } from 'next/navigation';

export default function TasksPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'kanban'; // kanban or backlog

  return (
    <div className="flex h-screen w-screen bg-slate-100 overflow-hidden">
      <Sidebar currentView={view === 'backlog' ? ViewType.BACKLOG : ViewType.KANBAN} />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative shadow-xl">
        {view === 'backlog' ? <BacklogView /> : <KanbanBoard />}
      </main>
    </div>
  );
}

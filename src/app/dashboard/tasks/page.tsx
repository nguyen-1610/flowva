import React from 'react';
import Sidebar from '@/frontend/components/Sidebar';
import KanbanBoard from '@/frontend/features/tasks/components/KanbanBoard';
import BacklogView from '@/frontend/features/tasks/components/BacklogView';
import { ViewType } from '@/shared/types/ui';

// TODO: Replace with actual data fetching from database
async function getTasks() {
  // Placeholder - will be replaced with actual Server Action
  return [];
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const view = params.view || 'kanban';
  const tasks = await getTasks();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      <Sidebar currentView={view === 'backlog' ? ViewType.BACKLOG : ViewType.KANBAN} />
      <main className="relative flex h-full flex-1 flex-col overflow-hidden shadow-xl">
        {view === 'backlog' ? <BacklogView tasks={tasks} /> : <KanbanBoard tasks={tasks} />}
      </main>
    </div>
  );
}

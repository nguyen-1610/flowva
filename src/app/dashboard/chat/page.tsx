'use client';

import React from 'react';
import Sidebar from '@/frontend/components/Sidebar';
import ChatInterface from '@/frontend/features/chat/components/ChatInterface';
import { ViewType } from '@/shared/types/ui';

export default function ChatPage() {
  return (
    <div className="flex h-screen w-screen bg-slate-100 overflow-hidden">
      <Sidebar currentView={ViewType.CHAT} />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative shadow-xl">
        <ChatInterface />
      </main>
    </div>
  );
}

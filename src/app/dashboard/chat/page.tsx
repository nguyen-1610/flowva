'use client';

import React from 'react';
import Sidebar from '@/frontend/components/Sidebar';
import ChatInterface from '@/frontend/features/chat/components/ChatInterface';
import { ViewType } from '@/shared/types/ui';

export default function ChatPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      <Sidebar currentView={ViewType.CHAT} />
      <main className="relative flex h-full flex-1 flex-col overflow-hidden shadow-xl">
        <ChatInterface />
      </main>
    </div>
  );
}

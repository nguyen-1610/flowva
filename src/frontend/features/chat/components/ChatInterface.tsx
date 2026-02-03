'use client';

import React, { useState } from 'react';
import { getMockAvatar } from '@/frontend/lib/avatar-utils';
import { ChatThread, Message } from '@/shared/types/ui-types';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import ChatInfoPanel from './ChatInfoPanel';

const ChatInterface: React.FC = () => {
  const [activeRightTab, setActiveRightTab] = useState<'info' | 'members' | 'documents'>('info');
  const [activeDocTab, setActiveDocTab] = useState<'media' | 'files' | 'links'>('files');

  // Sidebar states
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const [messageInput, setMessageInput] = useState('');

  // Mock Threads
  const threads: ChatThread[] = [
    {
      id: '1',
      name: 'Design Team',
      type: 'group',
      avatar: 'bg-purple-500',
      lastMessage: 'Updated the Figma file',
      lastMessageTime: '10:30 AM',
      unreadCount: 2,
    },
    {
      id: '2',
      name: 'Frontend Devs',
      type: 'group',
      avatar: 'bg-blue-500',
      lastMessage: 'API is returning 500 error',
      lastMessageTime: '9:45 AM',
      unreadCount: 0,
    },
    {
      id: '3',
      name: 'Sarah Miller',
      type: 'direct',
      avatar: getMockAvatar(1),
      lastMessage: 'Can you check my PR?',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
    },
    {
      id: '4',
      name: 'John Doe',
      type: 'direct',
      avatar: getMockAvatar(2),
      lastMessage: 'Thanks for the help!',
      lastMessageTime: 'Yesterday',
      unreadCount: 1,
    },
    {
      id: '5',
      name: 'Marketing',
      type: 'group',
      avatar: 'bg-green-500',
      lastMessage: 'Campaign starts tomorrow',
      lastMessageTime: 'Mon',
      unreadCount: 5,
    },
  ];

  // Mock Messages
  const currentMessages: Message[] = [
    {
      id: 'm1',
      senderId: 'others',
      content:
        "Hey team, I've just uploaded the final mocks for the task management dashboard. @designers please take a look!",
      timestamp: '10:24 AM',
    },
    {
      id: 'm2',
      senderId: 'me',
      content:
        "Awesome work Sarah! The spacing on the cards looks much better now. I'll start reviewing them right away.",
      timestamp: '10:26 AM',
    },
    {
      id: 'm3',
      senderId: 'others',
      content: 'Quick question, did we decide on the primary button radius for the mobile view?',
      timestamp: '10:30 AM',
    },
  ];

  return (
    <div className="relative flex h-full overflow-hidden bg-white">
      {/* 1. LEFT COLUMN: Channels / List */}
      <ChatSidebar
        isCollapsed={isLeftCollapsed}
        onToggleCollapse={() => setIsLeftCollapsed(!isLeftCollapsed)}
        threads={threads}
      />

      {/* 2. MIDDLE COLUMN: Chat Content */}
      <ChatArea
        messages={currentMessages}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        showRightSidebar={showRightSidebar}
        onToggleRightSidebar={() => setShowRightSidebar(!showRightSidebar)}
      />

      {/* 3. RIGHT COLUMN: Info Panel */}
      <ChatInfoPanel
        showRightSidebar={showRightSidebar}
        onCloseRightSidebar={() => setShowRightSidebar(false)}
        activeRightTab={activeRightTab}
        setActiveRightTab={setActiveRightTab}
        activeDocTab={activeDocTab}
        setActiveDocTab={setActiveDocTab}
      />
    </div>
  );
};

export default ChatInterface;

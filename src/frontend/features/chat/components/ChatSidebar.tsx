'use client';

import React from 'react';
import { Plus, ChevronLeft, ChevronRight, Hash } from 'lucide-react';
import { ChatThread } from '@/shared/types/ui-types';
import { cn } from '@/frontend/lib/utils';

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  threads: ChatThread[];
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isCollapsed, onToggleCollapse, threads }) => {
  return (
    <div
      className={cn(
        'relative flex h-full shrink-0 flex-col border-r border-slate-200 bg-slate-50 transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64',
      )}
    >
      {/* Left Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute top-6 -right-3 z-50 cursor-pointer rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow-sm hover:bg-slate-100"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header */}
      <div
        className={cn(
          'flex items-center border-b border-slate-200 p-4',
          isCollapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!isCollapsed && <h2 className="text-lg font-bold text-slate-800">Messages</h2>}
        <button className="cursor-pointer rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200">
          <Plus size={18} />
        </button>
      </div>

      {/* No Search Bar Here - Moved to Top Navigation as per request */}

      <div className="mt-2 flex-1 space-y-1 overflow-y-auto px-2">
        {/* Channels Section */}
        <div
          className={cn(
            'px-3 py-2 text-xs font-semibold tracking-wider text-slate-400 uppercase',
            isCollapsed ? 'text-center' : '',
          )}
        >
          {isCollapsed ? 'CH' : 'Channels'}
        </div>
        {threads
          .filter((t) => t.type === 'group')
          .map((thread) => (
            <div
              key={thread.id}
              className={cn(
                'group flex cursor-pointer items-center rounded-lg p-2.5 transition-colors',
                thread.id === '1'
                  ? 'border border-slate-200 bg-white shadow-sm'
                  : 'hover:bg-slate-200/50',
                isCollapsed ? 'justify-center' : '',
              )}
              title={isCollapsed ? thread.name : ''}
            >
              {isCollapsed ? (
                <div className="relative">
                  <Hash
                    size={20}
                    className={thread.id === '1' ? 'text-indigo-600' : 'text-slate-400'}
                  />
                  {thread.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-indigo-600"></span>
                  )}
                </div>
              ) : (
                <>
                  <span className="mr-2 w-4 text-lg font-bold text-slate-400">#</span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'truncate text-sm font-medium',
                        thread.id === '1' ? 'text-slate-900' : 'text-slate-600',
                      )}
                    >
                      {thread.name}
                    </p>
                    {thread.id === '1' && (
                      <p className="mt-0.5 truncate text-xs text-slate-400">{thread.lastMessage}</p>
                    )}
                  </div>
                  {thread.unreadCount > 0 && (
                    <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {thread.unreadCount}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}

        {/* DMs Section */}
        <div
          className={cn(
            'mt-4 flex items-center px-3 py-2 text-xs font-semibold tracking-wider text-slate-400 uppercase',
            isCollapsed ? 'justify-center' : 'justify-between',
          )}
        >
          {isCollapsed ? 'DM' : <span>Direct Messages</span>}
          {!isCollapsed && <Plus size={14} className="cursor-pointer hover:text-slate-600" />}
        </div>
        {threads
          .filter((t) => t.type === 'direct')
          .map((thread) => (
            <div
              key={thread.id}
              className={cn(
                'flex cursor-pointer items-center rounded-lg p-2.5 transition-colors hover:bg-slate-200/50',
                isCollapsed ? 'justify-center' : '',
              )}
              title={isCollapsed ? thread.name : ''}
            >
              <div className={cn('relative', isCollapsed ? '' : 'mr-3')}>
                <img src={thread.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-slate-50 bg-green-500"></span>
              </div>
              {!isCollapsed && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700">{thread.name}</p>
                  </div>
                  {thread.unreadCount > 0 && (
                    <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {thread.unreadCount}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatSidebar;

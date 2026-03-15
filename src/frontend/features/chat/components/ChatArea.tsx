'use client';

import React from 'react';
import Image from 'next/image';
import {
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  Send,
  AtSign,
  Plus,
  Users,
  CheckSquare,
  Link as LinkIcon,
} from 'lucide-react';
import { Message } from '@/shared/types/ui-types';
import { cn } from '@/frontend/lib/utils';
import { getMockAvatar } from '@/frontend/lib/avatar-utils';

interface ChatAreaProps {
  messages: Message[];
  messageInput: string;
  setMessageInput: (value: string) => void;
  showRightSidebar: boolean;
  onToggleRightSidebar: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  messageInput,
  setMessageInput,
  showRightSidebar,
  onToggleRightSidebar,
}) => {
  return (
    <div className="relative z-0 flex h-full min-w-0 flex-1 flex-col bg-white">
      {/* Chat Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-base font-bold text-slate-800">
            # design
            <span className="cursor-pointer text-slate-400 transition-colors hover:text-yellow-400 text-xs">
              ★
            </span>
          </div>
          <div className="mx-1 h-3 w-px bg-slate-300"></div>
          <p className="flex items-center gap-1 text-[10px] text-slate-500">
            <Users size={10} /> 12 members
          </p>
          <span className="ml-0.5 h-1 w-1 rounded-full bg-green-500"></span>
          <span className="text-[10px] font-medium text-green-600">Online now</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <button className="cursor-pointer rounded-full p-1.5 transition-colors hover:bg-slate-50 hover:text-indigo-600">
            <Phone size={16} />
          </button>
          <button className="cursor-pointer rounded-full p-1.5 transition-colors hover:bg-slate-50 hover:text-indigo-600">
            <Video size={16} />
          </button>
          <div className="mx-1 h-5 w-px bg-slate-200"></div>
          <button
            onClick={onToggleRightSidebar}
            className={cn(
              'cursor-pointer rounded-full p-1.5 transition-colors',
              showRightSidebar
                ? 'bg-indigo-50 text-indigo-600'
                : 'hover:bg-slate-50 hover:text-indigo-600',
            )}
          >
            <Info size={16} />
          </button>
        </div>
      </div>

      {/* Pinned Message / Topic */}
      <div className="flex items-center gap-2 border-b border-purple-100 bg-purple-50/50 px-4 py-1.5">
        <div className="rotate-45 transform text-purple-500">
          <Plus size={12} className="rotate-45" />
        </div>
        <p className="truncate text-[10px] font-medium text-purple-800">
          Pinned: New design system guidelines updated. Check the documentation link.
        </p>
      </div>

      {/* Messages List */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === 'me';
          const prevMsg = messages[index - 1];
          const showHeader = !prevMsg || prevMsg.senderId !== msg.senderId;

          return (
            <div key={msg.id} className={cn('group flex gap-3', isMe ? 'flex-row-reverse' : '')}>
              {/* Avatar */}
              <div className="w-8 shrink-0">
                {showHeader && !isMe && (
                  <Image
                    src={getMockAvatar(101)}
                    alt="Sarah"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                {showHeader && isMe && (
                  <Image
                    src={getMockAvatar(102)}
                    alt="Me"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
              </div>

              {/* Content */}
              <div className={cn('flex max-w-[75%] flex-col', isMe ? 'items-end' : 'items-start')}>
                {showHeader && (
                  <div
                    className={cn('mb-0.5 flex items-baseline gap-2', isMe ? 'flex-row-reverse' : '')}
                  >
                    <span className="text-xs font-bold text-slate-800">
                      {isMe ? 'You' : 'Sarah Chen'}
                    </span>
                    <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                  </div>
                )}
                <div
                  className={cn(
                    'px-3 py-2 text-sm leading-relaxed shadow-sm',
                    isMe
                      ? 'rounded-xl rounded-tr-none bg-indigo-600 text-white'
                      : 'rounded-xl rounded-tl-none border border-slate-100 bg-slate-50 text-slate-800',
                  )}
                >
                  {msg.content.split(' ').map((word, i) =>
                    word.startsWith('@') ? (
                      <span
                        key={i}
                        className={cn(
                          'cursor-pointer font-semibold',
                          isMe
                            ? 'text-indigo-200 hover:text-white'
                            : 'text-indigo-600 hover:underline',
                        )}
                      >
                        {word}{' '}
                      </span>
                    ) : (
                      word + ' '
                    ),
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Input */}
      <div className="border-t border-slate-200 bg-white p-3 px-4">
        <div className="mb-1.5 ml-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">Message #design</div>
        <div className="flex flex-col rounded-xl border border-slate-300 bg-white shadow-sm transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="max-h-24 min-h-10 w-full resize-none border-none bg-transparent p-2.5 text-sm focus:ring-0"
            placeholder="Type your message here..."
          />
          <div className="flex items-center justify-between rounded-b-xl border-t border-slate-100 bg-slate-50 p-1.5">
            <div className="flex items-center gap-0.5">
              <button className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-200">
                <Paperclip size={16} />
              </button>
              <button className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-200">
                <LinkIcon size={16} />
              </button>
              <button className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-200">
                <Smile size={16} />
              </button>
              <button className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-200">
                <AtSign size={16} />
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="flex cursor-pointer items-center gap-1 rounded-lg bg-purple-100 px-2.5 py-1.5 text-[10px] font-bold text-purple-700 transition-colors hover:bg-purple-200">
                <CheckSquare size={12} /> Create Task
              </button>
              <button
                className={cn(
                  'cursor-pointer rounded-lg p-1.5 transition-colors',
                  messageInput
                    ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                    : 'bg-slate-200 text-slate-400',
                )}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ChatArea;

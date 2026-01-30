'use client';

import React, { useState } from 'react';
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
  Download,
  Upload,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Hash,
} from 'lucide-react';
import { ChatThread, Message } from '@/shared/types/ui-types';
import { cn } from '@/frontend/lib/utils';

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
      avatar: 'https://picsum.photos/40/40?random=1',
      lastMessage: 'Can you check my PR?',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
    },
    {
      id: '4',
      name: 'John Doe',
      type: 'direct',
      avatar: 'https://picsum.photos/40/40?random=2',
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

  // Mock Members Data
  const memberWorkloads = [
    { id: 1, name: 'Sarah Chen', role: 'Lead Designer', workload: 85, color: 'bg-purple-500' },
    { id: 2, name: 'Alex Rivera', role: 'Senior Backend Dev', workload: 42, color: 'bg-blue-500' },
    { id: 3, name: 'Jordan Lee', role: 'Product Manager', workload: 60, color: 'bg-indigo-500' },
    { id: 4, name: 'Marcus Kim', role: 'QA Engineer', workload: 15, color: 'bg-green-500' },
  ];

  // Mock Documents Data
  const documents = [
    { id: 1, name: 'Brand_Guidelines_v2.pdf', size: '4.2 MB', date: 'Oct 12, 2023', type: 'pdf' },
    { id: 2, name: 'Dashboard_Final.fig', size: '12.8 MB', date: 'Oct 15, 2023', type: 'figma' },
    { id: 3, name: 'Assets_Package.zip', size: '156.4 MB', date: 'Oct 18, 2023', type: 'zip' },
    { id: 4, name: 'Requirements_Doc_v1.docx', size: '840 KB', date: 'Yesterday', type: 'doc' },
    { id: 5, name: 'Q3_Feedback_Summary.pdf', size: '1.1 MB', date: '2:30 PM', type: 'pdf' },
  ];

  return (
    <div className="relative flex h-full overflow-hidden bg-white">
      {/* 1. LEFT COLUMN: Channels / List (Matches Sidebar Dimensions) */}
      <div
        className={cn(
          'relative flex h-full flex-shrink-0 flex-col border-r border-slate-200 bg-slate-50 transition-all duration-300',
          isLeftCollapsed ? 'w-20' : 'w-64',
        )}
      >
        {/* Left Toggle Button */}
        <button
          onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
          className="absolute top-6 -right-3 z-50 cursor-pointer rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow-sm hover:bg-slate-100"
        >
          {isLeftCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Header */}
        <div
          className={cn(
            'flex items-center border-b border-slate-200 p-4',
            isLeftCollapsed ? 'justify-center' : 'justify-between',
          )}
        >
          {!isLeftCollapsed && <h2 className="text-lg font-bold text-slate-800">Messages</h2>}
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
              isLeftCollapsed ? 'text-center' : '',
            )}
          >
            {isLeftCollapsed ? 'CH' : 'Channels'}
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
                  isLeftCollapsed ? 'justify-center' : '',
                )}
                title={isLeftCollapsed ? thread.name : ''}
              >
                {isLeftCollapsed ? (
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
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {thread.lastMessage}
                        </p>
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
              isLeftCollapsed ? 'justify-center' : 'justify-between',
            )}
          >
            {isLeftCollapsed ? 'DM' : <span>Direct Messages</span>}
            {!isLeftCollapsed && <Plus size={14} className="cursor-pointer hover:text-slate-600" />}
          </div>
          {threads
            .filter((t) => t.type === 'direct')
            .map((thread) => (
              <div
                key={thread.id}
                className={cn(
                  'flex cursor-pointer items-center rounded-lg p-2.5 transition-colors hover:bg-slate-200/50',
                  isLeftCollapsed ? 'justify-center' : '',
                )}
                title={isLeftCollapsed ? thread.name : ''}
              >
                <div className={cn('relative', isLeftCollapsed ? '' : 'mr-3')}>
                  <img src={thread.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                  <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-slate-50 bg-green-500"></span>
                </div>
                {!isLeftCollapsed && (
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

      {/* 2. MIDDLE COLUMN: Chat Content */}
      <div className="relative z-0 flex h-full min-w-0 flex-1 flex-col bg-white">
        {/* Chat Header */}
        <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
              # design
              <span className="cursor-pointer text-slate-400 transition-colors hover:text-yellow-400">
                ★
              </span>
            </div>
            <div className="mx-1 h-4 w-px bg-slate-300"></div>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <Users size={12} /> 12 members
            </p>
            <span className="ml-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
            <span className="text-xs font-medium text-green-600">Online now</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <button className="cursor-pointer rounded-full p-2 transition-colors hover:bg-slate-50 hover:text-indigo-600">
              <Phone size={18} />
            </button>
            <button className="cursor-pointer rounded-full p-2 transition-colors hover:bg-slate-50 hover:text-indigo-600">
              <Video size={18} />
            </button>
            <div className="mx-1 h-6 w-px bg-slate-200"></div>
            <button
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className={cn(
                'cursor-pointer rounded-full p-2 transition-colors',
                showRightSidebar
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'hover:bg-slate-50 hover:text-indigo-600',
              )}
            >
              <Info size={18} />
            </button>
          </div>
        </div>

        {/* Pinned Message / Topic */}
        <div className="flex items-center gap-2 border-b border-purple-100 bg-purple-50 px-6 py-2">
          <div className="rotate-45 transform text-purple-500">
            <Plus size={14} className="rotate-45" />
          </div>
          <p className="truncate text-xs font-medium text-purple-800">
            Pinned: New design system guidelines updated. Check the documentation link.
          </p>
        </div>

        {/* Messages List */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {currentMessages.map((msg, index) => {
            const isMe = msg.senderId === 'me';
            const prevMsg = currentMessages[index - 1];
            const showHeader = !prevMsg || prevMsg.senderId !== msg.senderId;

            return (
              <div key={msg.id} className={cn('group flex gap-4', isMe ? 'flex-row-reverse' : '')}>
                {/* Avatar */}
                <div className="w-10 flex-shrink-0">
                  {showHeader && !isMe && (
                    <img
                      src="https://picsum.photos/40/40?random=101"
                      alt="Sarah"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                  {showHeader && isMe && (
                    <img
                      src="https://picsum.photos/40/40?random=102"
                      alt="Me"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                </div>

                {/* Content */}
                <div
                  className={cn('flex max-w-[70%] flex-col', isMe ? 'items-end' : 'items-start')}
                >
                  {showHeader && (
                    <div
                      className={cn(
                        'mb-1 flex items-baseline gap-2',
                        isMe ? 'flex-row-reverse' : '',
                      )}
                    >
                      <span className="text-sm font-bold text-slate-800">
                        {isMe ? 'You' : 'Sarah Chen'}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                  )}
                  <div
                    className={cn(
                      'px-4 py-3 text-sm leading-relaxed shadow-sm',
                      isMe
                        ? 'rounded-2xl rounded-tr-none bg-indigo-600 text-white'
                        : 'rounded-2xl rounded-tl-none border border-slate-100 bg-slate-50 text-slate-800',
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
        <div className="border-t border-slate-200 bg-white p-4 px-6">
          <div className="mb-2 ml-1 text-xs font-medium text-slate-400">Message #design</div>
          <div className="flex flex-col rounded-xl border border-slate-300 bg-white shadow-sm transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="max-h-[150px] min-h-[60px] w-full resize-none border-none bg-transparent p-3 text-sm focus:ring-0"
              placeholder="Type your message here..."
            />
            <div className="flex items-center justify-between rounded-b-xl border-t border-slate-100 bg-slate-50 p-2">
              <div className="flex items-center gap-1">
                <button className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200">
                  <Paperclip size={18} />
                </button>
                <button className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200">
                  <LinkIcon size={18} />
                </button>
                <button className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200">
                  <Smile size={18} />
                </button>
                <button className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200">
                  <AtSign size={18} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-purple-100 px-3 py-1.5 text-xs font-bold text-purple-700 transition-colors hover:bg-purple-200">
                  <CheckSquare size={14} /> Create Task
                </button>
                <button
                  className={cn(
                    'cursor-pointer rounded-lg p-2 transition-colors',
                    messageInput
                      ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                      : 'bg-slate-200 text-slate-400',
                  )}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RIGHT COLUMN: Info Panel (Collapsible) */}
      <div
        className={cn(
          'relative flex h-full flex-shrink-0 flex-col overflow-hidden border-l border-slate-200 bg-white transition-all duration-300 ease-in-out',
          showRightSidebar ? 'w-80 opacity-100' : 'w-0 opacity-0',
        )}
      >
        {/* Right Toggle Button (Visible when open, attached to left edge of right sidebar) */}
        {showRightSidebar && (
          <button
            onClick={() => setShowRightSidebar(false)}
            className="absolute top-20 -left-3 z-50 cursor-pointer rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow-sm hover:bg-slate-100"
          >
            <ChevronRight size={14} />
          </button>
        )}

        {/* Tabs Header */}
        <div className="flex border-b border-slate-200">
          {['Info', 'Members', 'Documents'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveRightTab(tab.toLowerCase() as any)}
              className={cn(
                'flex-1 cursor-pointer border-b-2 py-4 text-xs font-bold tracking-wider uppercase transition-colors',
                activeRightTab === tab.toLowerCase()
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="min-w-[320px] flex-1 overflow-y-auto p-5">
          {/* CONTENT: INFO TAB */}
          {activeRightTab === 'info' && (
            <div className="animate-in fade-in space-y-8 duration-300">
              {/* Project Progress */}
              <div className="text-center">
                <h3 className="mb-4 text-left text-sm font-bold text-slate-800">
                  Project Progress
                </h3>
                <div className="relative mx-auto mb-2 flex h-32 w-32 items-center justify-center">
                  <svg className="h-full w-full -rotate-90 transform">
                    <circle cx="64" cy="64" r="56" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#8b5cf6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="351"
                      strokeDashoffset="87"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800">75%</span>
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Done
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-2 text-xs">
                  <div className="text-center">
                    <div className="mb-1 text-slate-400">Tasks Done</div>
                    <div className="text-base font-bold text-slate-800">18/24</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-1 text-slate-400">Deadline</div>
                    <div className="text-base font-bold text-red-500">Oct 24</div>
                  </div>
                </div>
              </div>

              {/* Sprint Info */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Sprint Deadline
                  </h3>
                  <button className="cursor-pointer text-xs font-semibold text-indigo-600 hover:underline">
                    View Roadmap
                  </button>
                </div>
                <div className="rounded-xl border border-l-4 border-slate-100 border-l-purple-500 bg-slate-50 p-4">
                  <h4 className="font-bold text-slate-800">Sprint 24 Review</h4>
                  <p className="mt-1 text-xs text-slate-500">Thursday, Oct 24 • 10:00 AM</p>
                </div>
              </div>

              {/* Activity Feed */}
              <div>
                <h3 className="mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Activity Feed
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <AtSign size={14} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-700">
                        <span className="font-bold">Sarah Chen</span> mentioned you in{' '}
                        <span className="font-bold">#design</span>
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">2 mins ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <Info size={14} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-700">
                        Task <span className="font-bold">TASK-124</span> is overdue.
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <CheckSquare size={14} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-700">
                        <span className="font-bold">Alex</span> completed{' '}
                        <span className="italic">Landing Page Mocks</span>
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTENT: MEMBERS TAB */}
          {activeRightTab === 'members' && (
            <div className="animate-in fade-in space-y-4 duration-300">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Team Workload
                </h3>
                <button className="cursor-pointer text-xs font-semibold text-indigo-600 hover:underline">
                  Manage
                </button>
              </div>

              {memberWorkloads.map((member) => (
                <div
                  key={member.id}
                  className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-colors hover:border-slate-300"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={`https://picsum.photos/40/40?random=${member.id + 50}`}
                        alt={member.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div
                        className={cn(
                          'absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white',
                          member.id === 4 ? 'bg-yellow-400' : 'bg-green-500',
                        )}
                      ></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-bold text-slate-800">{member.name}</h4>
                      <p className="truncate text-xs text-slate-500">{member.role}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{member.workload}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn('h-full rounded-full', member.color)}
                      style={{ width: `${member.workload}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700">
                  <Users size={16} /> Invite Member
                </button>
              </div>
            </div>
          )}

          {/* CONTENT: DOCUMENTS TAB */}
          {activeRightTab === 'documents' && (
            <div className="animate-in fade-in flex h-full flex-col duration-300">
              {/* Sub Tabs */}
              <div className="mb-4 flex rounded-lg bg-slate-100 p-1">
                {['Media', 'Files', 'Links'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveDocTab(sub.toLowerCase() as any)}
                    className={cn(
                      'flex-1 cursor-pointer rounded-md py-1.5 text-xs font-semibold transition-all',
                      activeDocTab === sub.toLowerCase()
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700',
                    )}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {activeDocTab === 'files' &&
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm',
                          doc.type === 'pdf'
                            ? 'bg-red-500'
                            : doc.type === 'figma'
                              ? 'bg-purple-500'
                              : doc.type === 'zip'
                                ? 'bg-yellow-500'
                                : 'bg-blue-500',
                        )}
                      >
                        {doc.type.toUpperCase().substring(0, 3)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
                          {doc.name}
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          {doc.size} • {doc.date}
                        </p>
                      </div>
                      <button className="text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-slate-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  ))}

                {activeDocTab === 'media' && (
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-slate-200"
                      >
                        <img
                          src={`https://picsum.photos/200/200?random=${i + 200}`}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                          <Download className="text-white drop-shadow-md" size={20} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeDocTab === 'links' && (
                  <div className="py-10 text-center text-slate-400">
                    <LinkIcon size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No links shared yet.</p>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4">
                <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700">
                  <Upload size={16} /> Upload New File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

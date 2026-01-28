'use client';

import React, { useState } from 'react';
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Send,
  FileText,
  Clock,
  AtSign,
  Image,
  Bell,
  Plus,
  Users,
  BarChart2,
  ChevronRight,
  ChevronLeft,
  PieChart,
} from 'lucide-react';
import { ChatThread, Message } from '@/shared/types/ui';

const ChatInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'files' | 'members'>('info');
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [isThreadsCollapsed, setIsThreadsCollapsed] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  // Mock Data
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

  const currentMessages: Message[] = [
    {
      id: 'm1',
      senderId: 'others',
      content: 'Hey everyone! Just reminding you about the design review at 2 PM.',
      timestamp: '10:00 AM',
    },
    {
      id: 'm2',
      senderId: 'me',
      content: 'Thanks for the reminder. I am preparing the slides now.',
      timestamp: '10:05 AM',
    },
    {
      id: 'm3',
      senderId: 'others',
      content: '@Alex Designer Did you upload the new assets?',
      timestamp: '10:15 AM',
    },
    {
      id: 'm4',
      senderId: 'me',
      content: 'Yes, just uploaded them. Check the files tab.',
      timestamp: '10:16 AM',
      attachments: [{ type: 'image', url: 'https://picsum.photos/200/150', name: 'preview.jpg' }],
    },
    { id: 'm5', senderId: 'others', content: 'Perfect! Looking good. 👍', timestamp: '10:17 AM' },
  ];

  const sharedFiles = [
    { id: 1, name: 'Q4_Roadmap.pdf', size: '2.4 MB', date: 'Oct 20' },
    { id: 2, name: 'Design_System_v2.fig', size: '15.8 MB', date: 'Oct 18' },
    { id: 3, name: 'Meeting_Notes.docx', size: '15 KB', date: 'Oct 15' },
    { id: 4, name: 'Assets.zip', size: '45 MB', date: 'Oct 12' },
  ];

  const notifications = [
    { id: 1, type: 'mention', text: 'Sarah mentioned you in #general', time: '10 min ago' },
    { id: 2, type: 'deadline', text: 'Design Review due in 4 hours', time: 'Urgent' },
    { id: 3, type: 'calendar', text: 'Team Sync at 3:00 PM', time: 'Today' },
  ];

  const memberWorkloads = [
    { id: 1, name: 'Alex Designer', role: 'Lead Designer', workload: 85, color: 'bg-red-500' },
    { id: 2, name: 'Sarah Miller', role: 'UX Researcher', workload: 60, color: 'bg-blue-500' },
    { id: 3, name: 'John Doe', role: 'Frontend Dev', workload: 45, color: 'bg-green-500' },
    { id: 4, name: 'Emily Chen', role: 'Product Manager', workload: 92, color: 'bg-purple-500' },
    { id: 5, name: 'Mike Ross', role: 'Backend Dev', workload: 30, color: 'bg-yellow-500' },
  ];

  return (
    <div className="relative flex h-full overflow-hidden bg-white">
      {/* LEFT COLUMN: Threads List (Collapsible) */}
      <div
        className={`${isThreadsCollapsed ? 'w-20' : 'w-80'} relative flex h-full flex-shrink-0 flex-col border-r border-slate-200 bg-slate-50/50 transition-all duration-300`}
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsThreadsCollapsed(!isThreadsCollapsed)}
          className="absolute top-6 -right-3 z-20 rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow-sm hover:bg-slate-100"
        >
          {isThreadsCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={`p-4 ${isThreadsCollapsed ? 'flex justify-center' : ''}`}>
          {!isThreadsCollapsed ? (
            <>
              <h2 className="mb-4 px-2 text-xl font-bold text-slate-800">Messages</h2>
              <div className="relative">
                <Search className="absolute top-2.5 left-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full rounded-full border-none bg-slate-100 py-2 pr-4 pl-10 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </>
          ) : (
            <div className="mt-2 mb-4">
              <Search className="cursor-pointer text-slate-400 hover:text-indigo-600" size={24} />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className={`flex items-center ${isThreadsCollapsed ? 'justify-center py-3' : 'p-3 px-4'} cursor-pointer transition-colors hover:bg-slate-100 ${thread.id === '1' ? 'border-r-4 border-indigo-500 bg-blue-50' : ''}`}
            >
              <div className="group relative">
                {thread.type === 'group' ? (
                  <div
                    className={`h-12 w-12 rounded-full ${thread.avatar} flex items-center justify-center text-sm font-bold text-white`}
                  >
                    {thread.name.substring(0, 2).toUpperCase()}
                  </div>
                ) : (
                  <img
                    src={thread.avatar}
                    alt={thread.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>

                {/* Tooltip for collapsed mode */}
                {isThreadsCollapsed && (
                  <div className="pointer-events-none absolute top-1/2 left-14 z-50 -translate-y-1/2 rounded bg-slate-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {thread.name}
                    {thread.unreadCount > 0 && (
                      <span className="ml-2 rounded-full bg-indigo-500 px-1.5">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!isThreadsCollapsed && (
                <>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="flex items-baseline justify-between">
                      <h3
                        className={`truncate text-sm font-semibold ${thread.id === '1' ? 'text-indigo-900' : 'text-slate-800'}`}
                      >
                        {thread.name}
                      </h3>
                      <span className="text-xs text-slate-400">{thread.lastMessageTime}</span>
                    </div>
                    <p
                      className={`truncate text-sm ${thread.unreadCount > 0 ? 'font-bold text-slate-800' : 'text-slate-500'}`}
                    >
                      {thread.lastMessage}
                    </p>
                  </div>
                  {thread.unreadCount > 0 && (
                    <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      {thread.unreadCount}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR TOGGLE BUTTON */}
      <button
        onClick={() => setShowRightSidebar(!showRightSidebar)}
        className={`absolute top-20 z-40 rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow-sm transition-all duration-300 hover:bg-slate-100 ${
          showRightSidebar ? 'right-[20rem] translate-x-1/2' : 'right-4'
        }`}
      >
        {showRightSidebar ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* CENTER COLUMN: Chat Area */}
      <div className="relative flex h-full min-w-0 flex-1 flex-col bg-white">
        {/* Chat Header */}
        <div className="z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 font-bold text-white">
              DT
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Design Team</h2>
              <p className="flex items-center gap-1 text-xs text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> 5 members online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-indigo-600">
            <button className="rounded-full p-2 transition-colors hover:bg-slate-100">
              <Phone size={20} />
            </button>
            <button className="rounded-full p-2 transition-colors hover:bg-slate-100">
              <Video size={20} />
            </button>
            <button className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50 p-6">
          <div className="flex justify-center">
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-500">
              Today, October 24
            </span>
          </div>

          {currentMessages.map((msg) => {
            const isMe = msg.senderId === 'me';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <img
                    src="https://picsum.photos/32/32?random=99"
                    alt="Sender"
                    className="mt-1 mr-2 h-8 w-8 rounded-full"
                  />
                )}
                <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div
                    className={`rounded-2xl p-3 text-sm shadow-sm ${
                      isMe
                        ? 'rounded-br-none bg-indigo-600 text-white'
                        : 'rounded-bl-none border border-slate-100 bg-white text-slate-800'
                    }`}
                  >
                    {msg.content}
                    {msg.attachments &&
                      msg.attachments.map((att, idx) => (
                        <div key={idx} className="mt-2 overflow-hidden rounded-lg">
                          {att.type === 'image' && (
                            <img src={att.url} alt={att.name} className="h-auto w-full" />
                          )}
                        </div>
                      ))}
                  </div>
                  <span className="mt-1 px-1 text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 bg-white p-4">
          <div className="flex items-end gap-2 rounded-xl bg-slate-100 p-2">
            <button className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-indigo-600">
              <Paperclip size={20} />
            </button>
            <button className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-indigo-600">
              <Image size={20} />
            </button>
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="max-h-32 flex-1 resize-none border-none bg-transparent py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-0"
              rows={1}
              style={{ minHeight: '40px' }}
            />
            <button className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-indigo-600">
              <Smile size={20} />
            </button>
            <button
              className={`rounded-full p-2 transition-colors ${messageInput ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-400'}`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Context/Info (Toggleable) */}
      <div
        className={`relative flex h-full flex-shrink-0 flex-col border-l border-slate-200 bg-white transition-all duration-300 ease-in-out ${
          showRightSidebar
            ? 'w-80 translate-x-0'
            : 'w-0 translate-x-full overflow-hidden border-none opacity-0'
        }`}
      >
        <div className="flex min-w-[320px] border-b border-slate-200">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 border-b-2 py-4 text-xs font-semibold tracking-wider uppercase transition-colors ${activeTab === 'info' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Info
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 border-b-2 py-4 text-xs font-semibold tracking-wider uppercase transition-colors ${activeTab === 'members' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 border-b-2 py-4 text-xs font-semibold tracking-wider uppercase transition-colors ${activeTab === 'files' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Files
          </button>
        </div>

        <div className="min-w-[320px] flex-1 overflow-y-auto p-4">
          {activeTab === 'info' ? (
            <div className="space-y-6">
              {/* Project Progress Section (NEW) */}
              <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-900 uppercase">
                    <PieChart size={14} /> Project Progress
                  </h3>
                  <span className="text-sm font-bold text-indigo-600">75%</span>
                </div>
                <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full border border-indigo-100 bg-white">
                  <div className="h-2.5 rounded-full bg-indigo-600" style={{ width: '75%' }}></div>
                </div>
                <p className="text-center text-xs font-medium text-indigo-400">
                  Sprint 24 ends in 2 days
                </p>
              </div>

              {/* Notifications Section */}
              <div>
                <h3 className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Notifications
                </h3>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
                    >
                      <div
                        className={`mt-0.5 rounded-full p-1.5 ${
                          notif.type === 'mention'
                            ? 'bg-blue-100 text-blue-600'
                            : notif.type === 'deadline'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-orange-100 text-orange-600'
                        }`}
                      >
                        {notif.type === 'mention' && <AtSign size={14} />}
                        {notif.type === 'deadline' && <Clock size={14} />}
                        {notif.type === 'calendar' && <Bell size={14} />}
                      </div>
                      <div>
                        <p className="text-sm leading-snug text-slate-800">{notif.text}</p>
                        <p className="mt-1 text-xs font-medium text-slate-400">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  About
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Official channel for the Design Team. Discussing UX/UI tasks for Project Alpha.
                </p>
              </div>
            </div>
          ) : activeTab === 'members' ? (
            <div className="space-y-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Project Workload
                </h3>
                <BarChart2 size={16} className="text-slate-400" />
              </div>

              {memberWorkloads.map((member) => (
                <div
                  key={member.id}
                  className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <img
                      src={`https://picsum.photos/40/40?random=${member.id + 20}`}
                      alt={member.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{member.name}</p>
                      <p className="truncate text-xs text-slate-500">{member.role}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-700">{member.workload}%</span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${member.color}`}
                      style={{ width: `${member.workload}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-2 text-sm text-slate-500 transition-colors hover:border-indigo-400 hover:text-indigo-600">
                <Plus size={16} /> Invite Member
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
                Shared Files
              </h3>
              {sharedFiles.map((file) => (
                <div
                  key={file.id}
                  className="group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-slate-100 hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800 transition-colors group-hover:text-indigo-600">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {file.size} • {file.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

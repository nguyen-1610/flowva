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
  PieChart
} from 'lucide-react';
import { ChatThread, Message } from '@/shared/types/ui';

const ChatInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'files' | 'members'>('info');
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [isThreadsCollapsed, setIsThreadsCollapsed] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  // Mock Data
  const threads: ChatThread[] = [
    { id: '1', name: 'Design Team', type: 'group', avatar: 'bg-purple-500', lastMessage: 'Updated the Figma file', lastMessageTime: '10:30 AM', unreadCount: 2 },
    { id: '2', name: 'Frontend Devs', type: 'group', avatar: 'bg-blue-500', lastMessage: 'API is returning 500 error', lastMessageTime: '9:45 AM', unreadCount: 0 },
    { id: '3', name: 'Sarah Miller', type: 'direct', avatar: 'https://picsum.photos/40/40?random=1', lastMessage: 'Can you check my PR?', lastMessageTime: 'Yesterday', unreadCount: 0 },
    { id: '4', name: 'John Doe', type: 'direct', avatar: 'https://picsum.photos/40/40?random=2', lastMessage: 'Thanks for the help!', lastMessageTime: 'Yesterday', unreadCount: 1 },
    { id: '5', name: 'Marketing', type: 'group', avatar: 'bg-green-500', lastMessage: 'Campaign starts tomorrow', lastMessageTime: 'Mon', unreadCount: 5 },
  ];

  const currentMessages: Message[] = [
    { id: 'm1', senderId: 'others', content: 'Hey everyone! Just reminding you about the design review at 2 PM.', timestamp: '10:00 AM' },
    { id: 'm2', senderId: 'me', content: 'Thanks for the reminder. I am preparing the slides now.', timestamp: '10:05 AM' },
    { id: 'm3', senderId: 'others', content: '@Alex Designer Did you upload the new assets?', timestamp: '10:15 AM' },
    { id: 'm4', senderId: 'me', content: 'Yes, just uploaded them. Check the files tab.', timestamp: '10:16 AM', attachments: [{ type: 'image', url: 'https://picsum.photos/200/150', name: 'preview.jpg' }] },
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
    <div className="flex h-full bg-white overflow-hidden relative">
      {/* LEFT COLUMN: Threads List (Collapsible) */}
      <div className={`${isThreadsCollapsed ? 'w-20' : 'w-80'} border-r border-slate-200 flex flex-col h-full bg-slate-50/50 flex-shrink-0 transition-all duration-300 relative`}>
        {/* Sidebar Toggle Button */}
        <button 
          onClick={() => setIsThreadsCollapsed(!isThreadsCollapsed)}
          className="absolute -right-3 top-6 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-100 text-slate-500 z-20"
        >
           {isThreadsCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={`p-4 ${isThreadsCollapsed ? 'flex justify-center' : ''}`}>
          {!isThreadsCollapsed ? (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-4 px-2">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </>
          ) : (
            <div className="mb-4 mt-2">
               <Search className="text-slate-400 cursor-pointer hover:text-indigo-600" size={24} />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {threads.map(thread => (
            <div 
              key={thread.id} 
              className={`flex items-center ${isThreadsCollapsed ? 'justify-center py-3' : 'p-3 px-4'} cursor-pointer hover:bg-slate-100 transition-colors ${thread.id === '1' ? 'bg-blue-50 border-r-4 border-indigo-500' : ''}`}
            >
              <div className="relative group">
                {thread.type === 'group' ? (
                  <div className={`w-12 h-12 rounded-full ${thread.avatar} flex items-center justify-center text-white font-bold text-sm`}>
                    {thread.name.substring(0, 2).toUpperCase()}
                  </div>
                ) : (
                  <img src={thread.avatar} alt={thread.name} className="w-12 h-12 rounded-full object-cover" />
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                
                {/* Tooltip for collapsed mode */}
                {isThreadsCollapsed && (
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none transition-opacity">
                        {thread.name}
                        {thread.unreadCount > 0 && <span className="ml-2 bg-indigo-500 px-1.5 rounded-full">{thread.unreadCount}</span>}
                    </div>
                )}
              </div>
              
              {!isThreadsCollapsed && (
                <>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className={`text-sm font-semibold truncate ${thread.id === '1' ? 'text-indigo-900' : 'text-slate-800'}`}>{thread.name}</h3>
                      <span className="text-xs text-slate-400">{thread.lastMessageTime}</span>
                    </div>
                    <p className={`text-sm truncate ${thread.unreadCount > 0 ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                      {thread.lastMessage}
                    </p>
                  </div>
                  {thread.unreadCount > 0 && (
                    <div className="ml-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
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
        className={`absolute top-20 z-40 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-100 text-slate-500 transition-all duration-300 ${
            showRightSidebar ? 'right-[20rem] translate-x-1/2' : 'right-4'
        }`}
      >
        {showRightSidebar ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* CENTER COLUMN: Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white relative min-w-0">
        {/* Chat Header */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">DT</div>
             <div>
               <h2 className="font-bold text-slate-800">Design Team</h2>
               <p className="text-xs text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 5 members online</p>
             </div>
          </div>
          <div className="flex items-center gap-4 text-indigo-600">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Phone size={20} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Video size={20} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          <div className="flex justify-center">
            <span className="bg-slate-200 text-slate-500 text-xs px-3 py-1 rounded-full">Today, October 24</span>
          </div>
          
          {currentMessages.map(msg => {
            const isMe = msg.senderId === 'me';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                   <img src="https://picsum.photos/32/32?random=99" alt="Sender" className="w-8 h-8 rounded-full mr-2 mt-1" />
                )}
                <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`p-3 rounded-2xl shadow-sm text-sm ${
                    isMe 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                  }`}>
                    {msg.content}
                    {msg.attachments && msg.attachments.map((att, idx) => (
                      <div key={idx} className="mt-2 rounded-lg overflow-hidden">
                        {att.type === 'image' && <img src={att.url} alt={att.name} className="w-full h-auto" />}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex items-end gap-2 bg-slate-100 p-2 rounded-xl">
             <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded-full transition-colors">
               <Paperclip size={20} />
             </button>
             <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded-full transition-colors">
               <Image size={20} />
             </button>
             <textarea 
               value={messageInput}
               onChange={(e) => setMessageInput(e.target.value)}
               placeholder="Type a message..." 
               className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 max-h-32 text-slate-800 text-sm placeholder:text-slate-400"
               rows={1}
               style={{ minHeight: '40px' }}
             />
             <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded-full transition-colors">
               <Smile size={20} />
             </button>
             <button className={`p-2 rounded-full transition-colors ${messageInput ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-400'}`}>
               <Send size={18} />
             </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Context/Info (Toggleable) */}
      <div 
        className={`border-l border-slate-200 bg-white flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out relative ${
          showRightSidebar ? 'w-80 translate-x-0' : 'w-0 translate-x-full opacity-0 overflow-hidden border-none'
        }`}
      >
           <div className="flex border-b border-slate-200 min-w-[320px]">
             <button 
               onClick={() => setActiveTab('info')}
               className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'info' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
               Info
             </button>
             <button 
               onClick={() => setActiveTab('members')}
               className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'members' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
               Members
             </button>
             <button 
               onClick={() => setActiveTab('files')}
               className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'files' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
               Files
             </button>
           </div>

           <div className="flex-1 overflow-y-auto p-4 min-w-[320px]">
             {activeTab === 'info' ? (
               <div className="space-y-6">
                  {/* Project Progress Section (NEW) */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                    <div className="flex items-center justify-between mb-3">
                       <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                         <PieChart size={14} /> Project Progress
                       </h3>
                       <span className="text-sm font-bold text-indigo-600">75%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2.5 mb-2 overflow-hidden border border-indigo-100">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-xs text-indigo-400 text-center font-medium">Sprint 24 ends in 2 days</p>
                  </div>

                  {/* Notifications Section */}
                  <div>
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Notifications</h3>
                     <div className="space-y-3">
                       {notifications.map(notif => (
                         <div key={notif.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className={`mt-0.5 p-1.5 rounded-full ${
                              notif.type === 'mention' ? 'bg-blue-100 text-blue-600' :
                              notif.type === 'deadline' ? 'bg-red-100 text-red-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              {notif.type === 'mention' && <AtSign size={14} />}
                              {notif.type === 'deadline' && <Clock size={14} />}
                              {notif.type === 'calendar' && <Bell size={14} />}
                            </div>
                            <div>
                              <p className="text-sm text-slate-800 leading-snug">{notif.text}</p>
                              <p className="text-xs text-slate-400 mt-1 font-medium">{notif.time}</p>
                            </div>
                         </div>
                       ))}
                     </div>
                  </div>
                  
                  {/* Description */}
                  <div>
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About</h3>
                     <p className="text-sm text-slate-600 leading-relaxed">
                       Official channel for the Design Team. Discussing UX/UI tasks for Project Alpha.
                     </p>
                  </div>
               </div>
             ) : activeTab === 'members' ? (
                <div className="space-y-5">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Workload</h3>
                      <BarChart2 size={16} className="text-slate-400" />
                   </div>
                   
                   {memberWorkloads.map((member) => (
                     <div key={member.id} className="bg-white rounded-lg border border-slate-100 p-3 shadow-sm">
                       <div className="flex items-center gap-3 mb-3">
                         <img src={`https://picsum.photos/40/40?random=${member.id + 20}`} alt={member.name} className="w-10 h-10 rounded-full" />
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-semibold text-slate-800 truncate">{member.name}</p>
                           <p className="text-xs text-slate-500 truncate">{member.role}</p>
                         </div>
                         <span className="text-sm font-bold text-slate-700">{member.workload}%</span>
                       </div>
                       
                       <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                         <div 
                           className={`h-full rounded-full ${member.color}`} 
                           style={{ width: `${member.workload}%` }}
                         ></div>
                       </div>
                     </div>
                   ))}

                   <button className="w-full mt-4 py-2 text-sm border border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
                      <Plus size={16} /> Invite Member
                   </button>
                </div>
             ) : (
               <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shared Files</h3>
                  {sharedFiles.map(file => (
                    <div key={file.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg group cursor-pointer border border-transparent hover:border-slate-100 transition-all">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{file.name}</p>
                        <p className="text-xs text-slate-400">{file.size} • {file.date}</p>
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

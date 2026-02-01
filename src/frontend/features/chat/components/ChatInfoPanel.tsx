'use client';

import React from 'react';
import {
  Info,
  Users,
  CheckSquare,
  Link as LinkIcon,
  Download,
  Upload,
  MoreHorizontal,
  ChevronRight,
  AtSign,
} from 'lucide-react';
import { cn } from '@/frontend/lib/utils';

interface ChatInfoPanelProps {
  showRightSidebar: boolean;
  onCloseRightSidebar: () => void;
  activeRightTab: 'info' | 'members' | 'documents';
  setActiveRightTab: (tab: 'info' | 'members' | 'documents') => void;
  activeDocTab: 'media' | 'files' | 'links';
  setActiveDocTab: (tab: 'media' | 'files' | 'links') => void;
}

const ChatInfoPanel: React.FC<ChatInfoPanelProps> = ({
  showRightSidebar,
  onCloseRightSidebar,
  activeRightTab,
  setActiveRightTab,
  activeDocTab,
  setActiveDocTab,
}) => {
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
    <div
      className={cn(
        'relative flex h-full shrink-0 flex-col overflow-hidden border-l border-slate-200 bg-white transition-all duration-300 ease-in-out',
        showRightSidebar ? 'w-80 opacity-100' : 'w-0 opacity-0',
      )}
    >
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
              <h3 className="mb-4 text-left text-sm font-bold text-slate-800">Project Progress</h3>
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
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
  );
};

export default ChatInfoPanel;

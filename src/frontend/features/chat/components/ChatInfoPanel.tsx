'use client';

import React from 'react';
import Image from 'next/image';
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
import { getMockAvatar } from '@/frontend/lib/avatar-utils';

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
        showRightSidebar ? 'w-72 opacity-100' : 'w-0 opacity-0',
      )}
    >
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200">
        {['Info', 'Members', 'Docs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveRightTab(tab.toLowerCase() === 'docs' ? 'documents' : tab.toLowerCase() as any)}
            className={cn(
              'flex-1 cursor-pointer border-b-2 py-2.5 text-[10px] font-bold tracking-wider uppercase transition-colors',
              (activeRightTab === tab.toLowerCase() || (tab === 'Docs' && activeRightTab === 'documents'))
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="min-w-[288px] flex-1 overflow-y-auto p-4">
        {/* CONTENT: INFO TAB */}
        {activeRightTab === 'info' && (
          <div className="animate-in fade-in space-y-6 duration-300">
            {/* Project Progress */}
            <div>
              <h3 className="mb-3 text-xs font-bold text-slate-800">Project Progress</h3>
              <div className="flex items-center gap-4">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90 transform">
                    <circle cx="40" cy="40" r="36" stroke="#f1f5f9" strokeWidth="6" fill="none" />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#8b5cf6"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="226"
                      strokeDashoffset="56"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-slate-800">75%</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Tasks Done</span>
                    <span className="font-bold text-slate-800">18/24</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Deadline</span>
                    <span className="font-bold text-red-500">Oct 24</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sprint Info */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Sprint Deadline
                </h3>
                <button className="cursor-pointer text-[10px] font-semibold text-indigo-600 hover:underline">
                  Roadmap
                </button>
              </div>
              <div className="rounded-lg border border-l-4 border-slate-100 border-l-purple-500 bg-slate-50 p-3">
                <h4 className="text-xs font-bold text-slate-800">Sprint 24 Review</h4>
                <p className="mt-0.5 text-[10px] text-slate-500">Oct 24 • 10:00 AM</p>
              </div>
            </div>

            {/* Activity Feed */}
            <div>
              <h3 className="mb-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Activity Feed
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <AtSign size={12} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-700 leading-tight">
                      <span className="font-bold">Sarah</span> mentioned you in{' '}
                      <span className="font-bold">#design</span>
                    </p>
                    <p className="mt-0.5 text-[9px] text-slate-400">2 mins ago</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <Info size={12} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-700 leading-tight">
                      Task <span className="font-bold">TASK-124</span> is overdue.
                    </p>
                    <p className="mt-0.5 text-[9px] text-slate-400">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTENT: MEMBERS TAB */}
        {activeRightTab === 'members' && (
          <div className="animate-in fade-in space-y-3 duration-300">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Workload
              </h3>
              <button className="cursor-pointer text-[10px] font-semibold text-indigo-600 hover:underline">
                Manage
              </button>
            </div>

            {memberWorkloads.map((member) => (
              <div
                key={member.id}
                className="rounded-lg border border-slate-100 bg-white p-2.5 shadow-sm transition-colors hover:border-slate-300"
              >
                <div className="mb-2 flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <Image
                      src={getMockAvatar(member.id)}
                      alt={member.name}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full"
                    />
                    <div
                      className={cn(
                        'absolute right-0 bottom-0 h-2 w-2 rounded-full border border-white',
                        member.id === 4 ? 'bg-yellow-400' : 'bg-green-500',
                      )}
                    ></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-xs font-bold text-slate-800">{member.name}</h4>
                    <p className="truncate text-[10px] text-slate-500">{member.role}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600">{member.workload}%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn('h-full rounded-full', member.color)}
                    style={{ width: `${member.workload}%` }}
                  ></div>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <button className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98]">
                <Users size={14} /> Invite Member
              </button>
            </div>
          </div>
        )}

        {/* CONTENT: DOCUMENTS TAB */}
        {activeRightTab === 'documents' && (
          <div className="animate-in fade-in flex h-full flex-col duration-300">
            {/* Sub Tabs */}
            <div className="mb-3 flex rounded-lg bg-slate-100 p-0.5">
              {['Media', 'Files', 'Links'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveDocTab(sub.toLowerCase() as any)}
                  className={cn(
                    'flex-1 cursor-pointer rounded-md py-1 text-[10px] font-bold transition-all',
                    activeDocTab === sub.toLowerCase()
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700',
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto">
              {activeDocTab === 'files' &&
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="group flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-2.5 transition-colors hover:bg-slate-100"
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded text-[9px] font-bold text-white shadow-sm',
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
                      <h4 className="truncate text-xs font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
                        {doc.name}
                      </h4>
                      <p className="text-[9px] text-slate-500">
                        {doc.size} • {doc.date}
                      </p>
                    </div>
                    <button className="text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-slate-600">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                ))}

              {activeDocTab === 'media' && (
                <div className="grid grid-cols-2 gap-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-slate-200"
                    >
                      <Image src={getMockAvatar(i)} alt="Media" fill className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <Download className="text-white drop-shadow-md" size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeDocTab === 'links' && (
                <div className="py-6 text-center text-slate-400">
                  <LinkIcon size={24} className="mx-auto mb-1.5 opacity-50" />
                  <p className="text-xs">No links shared yet.</p>
                </div>
              )}
            </div>

            <div className="mt-auto pt-3">
              <button className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98]">
                <Upload size={14} /> Upload
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default ChatInfoPanel;

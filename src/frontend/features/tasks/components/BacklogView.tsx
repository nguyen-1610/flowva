'use client';

import React from 'react';
import { Plus, ChevronDown, MoreHorizontal, User as UserIcon, GripVertical } from 'lucide-react';
import { Task, TaskStatus } from '@/shared/types/ui';

const mockBacklogTasks: Task[] = [
  { id: 't1', title: 'Design Homepage Mockup', status: TaskStatus.TODO, assignees: [], dueDate: 'Tomorrow', priority: 'High', tag: 'Design', sprint: 'Sprint 24' },
  { id: 't2', title: 'Integrate API Endpoints', status: TaskStatus.IN_PROGRESS, assignees: [], dueDate: 'Oct 24', priority: 'Medium', tag: 'Backend', sprint: 'Sprint 24' },
  { id: 't3', title: 'Write Documentation', status: TaskStatus.TODO, assignees: [], dueDate: 'Next Week', priority: 'Low', tag: 'Docs', sprint: 'Backlog' },
  { id: 't4', title: 'Fix Navigation Bug', status: TaskStatus.REVIEW, assignees: [], dueDate: 'Today', priority: 'High', tag: 'Bug', sprint: 'Sprint 24' },
  { id: 't6', title: 'Update Color Palette', status: TaskStatus.TODO, assignees: [], dueDate: 'Oct 30', priority: 'Low', tag: 'Design', sprint: 'Backlog' },
  { id: 't7', title: 'Database Migration', status: TaskStatus.TODO, assignees: [], dueDate: 'Nov 1', priority: 'High', tag: 'DevOps', sprint: 'Backlog' },
];

interface BacklogViewProps {
  tasks?: Task[];
}

const BacklogView: React.FC<BacklogViewProps> = ({ tasks = mockBacklogTasks }) => {
  const sprintTasks = tasks.filter(t => t.sprint === 'Sprint 24');
  const backlogTasks = tasks.filter(t => t.sprint === 'Backlog');

  const renderTaskRow = (task: Task) => (
    <div key={task.id} className="group flex items-center gap-3 bg-white p-2.5 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
      <GripVertical size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 cursor-move" />
      <div className={`w-4 h-4 rounded shadow-sm flex items-center justify-center border ${
        task.priority === 'High' ? 'bg-red-50 border-red-200' : 
        task.priority === 'Medium' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
             task.priority === 'High' ? 'bg-red-500' : 
             task.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'
        }`}></div>
      </div>
      <div className="flex-1 min-w-0">
         <span className="text-slate-400 text-xs font-mono mr-2">{task.id.toUpperCase()}</span>
         <span className="text-slate-700 text-sm font-medium">{task.title}</span>
      </div>
      
      <div className="flex items-center gap-4 px-2">
         <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-medium">{task.tag}</span>
         
         <div className="flex -space-x-1 w-16">
            <div className="w-6 h-6 rounded-full bg-slate-200 border border-white flex items-center justify-center text-slate-400">
                <UserIcon size={12} />
            </div>
         </div>
         
         <div className="w-20 text-right">
             <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                 task.status === 'DONE' ? 'bg-green-100 text-green-700' :
                 task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                 'bg-slate-100 text-slate-600'
             }`}>{task.status.replace('_', ' ')}</span>
         </div>
         
         <button className="text-slate-400 hover:text-slate-600">
            <MoreHorizontal size={16} />
         </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 h-full overflow-y-auto bg-white p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Backlog</h2>
          <p className="text-slate-500 text-sm mt-1">Project Alpha</p>
        </div>
        <div className="flex gap-2">
            <button className="text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-md text-sm font-medium">Insights</button>
            <button className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">Complete Sprint</button>
        </div>
      </div>

      {/* Active Sprint Section */}
      <div className="mb-8 bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center sticky top-0">
          <div className="flex items-center gap-2">
            <ChevronDown size={16} className="text-slate-500" />
            <h3 className="font-bold text-slate-700 text-sm">Sprint 24</h3>
            <span className="text-xs text-slate-400 font-medium">(Active) • 3 issues</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded font-medium">Oct 10 - Oct 24</span>
             <button className="p-1 hover:bg-slate-200 rounded"><MoreHorizontal size={16} className="text-slate-500" /></button>
          </div>
        </div>
        <div>
          {sprintTasks.map(renderTaskRow)}
          <div className="p-2 border-t border-slate-100 hover:bg-slate-50 transition-colors cursor-text">
             <div className="flex items-center gap-2 text-slate-500 p-1">
                <Plus size={16} />
                <span className="text-sm">Create issue</span>
             </div>
          </div>
        </div>
      </div>

      {/* Backlog Section */}
      <div className="bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
           <div className="flex items-center gap-2">
            <ChevronDown size={16} className="text-slate-500" />
            <h3 className="font-bold text-slate-700 text-sm">Backlog</h3>
            <span className="text-xs text-slate-400 font-medium">{backlogTasks.length} issues</span>
          </div>
           <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded transition-colors">
             Create Sprint
           </button>
        </div>
        <div className="min-h-[100px]">
           {backlogTasks.map(renderTaskRow)}
           <div className="p-2 border-t border-slate-100 hover:bg-slate-50 transition-colors cursor-text">
             <div className="flex items-center gap-2 text-slate-500 p-1">
                <Plus size={16} />
                <span className="text-sm">Create issue</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacklogView;

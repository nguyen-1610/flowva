'use client';

import React from 'react';
import { MoreHorizontal, Plus, Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { Task, TaskStatus, User } from '@/shared/types/ui';

const mockUsers: User[] = [
  { id: '1', name: 'Alice', avatar: 'https://picsum.photos/32/32?random=1' },
  { id: '2', name: 'Bob', avatar: 'https://picsum.photos/32/32?random=2' },
  { id: '3', name: 'Charlie', avatar: 'https://picsum.photos/32/32?random=3' },
];

const mockTasks: Task[] = [
  { id: 't1', title: 'Design Homepage Mockup', status: TaskStatus.TODO, assignees: [mockUsers[0]], dueDate: 'Tomorrow', priority: 'High', tag: 'Design' },
  { id: 't2', title: 'Integrate API Endpoints', status: TaskStatus.IN_PROGRESS, assignees: [mockUsers[1], mockUsers[2]], dueDate: 'Oct 24', priority: 'Medium', tag: 'Backend' },
  { id: 't3', title: 'Write Documentation', status: TaskStatus.TODO, assignees: [mockUsers[2]], dueDate: 'Next Week', priority: 'Low', tag: 'Docs' },
  { id: 't4', title: 'Fix Navigation Bug', status: TaskStatus.REVIEW, assignees: [mockUsers[0]], dueDate: 'Today', priority: 'High', tag: 'Bug' },
  { id: 't5', title: 'Setup CI/CD Pipeline', status: TaskStatus.DONE, assignees: [mockUsers[1]], dueDate: 'Oct 20', priority: 'Medium', tag: 'DevOps' },
];

const KanbanBoard: React.FC = () => {
  const columns = [
    { id: TaskStatus.TODO, title: 'To Do', color: 'bg-slate-100 border-t-4 border-slate-400' },
    { id: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'bg-blue-50 border-t-4 border-blue-500' },
    { id: TaskStatus.REVIEW, title: 'Review', color: 'bg-purple-50 border-t-4 border-purple-500' },
    { id: TaskStatus.DONE, title: 'Done', color: 'bg-green-50 border-t-4 border-green-500' },
  ];

  return (
    <div className="flex-1 h-full overflow-x-auto overflow-y-hidden bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sprint 24 Board</h2>
          <p className="text-slate-500 text-sm mt-1">Project Alpha • Software Development</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
                {mockUsers.map(u => (
                    <img key={u.id} src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border-2 border-white" />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500">+2</div>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                <Plus size={16} /> New Issue
            </button>
        </div>
      </div>

      <div className="flex h-[calc(100%-80px)] gap-6 pb-4">
        {columns.map((col) => {
          const tasks = mockTasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="w-80 flex-shrink-0 flex flex-col h-full rounded-lg bg-slate-50/80 border border-slate-200">
              <div className={`p-3 rounded-t-lg flex justify-between items-center ${col.color.split(' ')[2]} border-t-4 bg-white shadow-sm`}>
                <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                  {col.title}
                  <span className="bg-slate-100 text-slate-500 text-xs py-0.5 px-2 rounded-full">{tasks.length}</span>
                </h3>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-white p-4 rounded-md shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        task.priority === 'High' ? 'bg-red-50 text-red-600' :
                        task.priority === 'Medium' ? 'bg-orange-50 text-orange-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {task.tag}
                      </span>
                      <button className="text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-500">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                    <h4 className="text-sm font-medium text-slate-800 leading-tight mb-3">{task.title}</h4>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        {task.dueDate === 'Today' || task.dueDate === 'Tomorrow' ? (
                             <span className="flex items-center gap-1 text-red-500 font-medium">
                                <Calendar size={12} /> {task.dueDate}
                             </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <Calendar size={12} /> {task.dueDate}
                             </span>
                        )}
                      </div>
                      <div className="flex -space-x-1">
                        {task.assignees.map(u => (
                          <img key={u.id} src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full border border-white" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-50 text-slate-400">
                         <div className="flex items-center gap-1 text-xs">
                             <MessageSquare size={12} /> 2
                         </div>
                         <div className="flex items-center gap-1 text-xs">
                             <Paperclip size={12} /> 1
                         </div>
                    </div>
                  </div>
                ))}
                
                <button className="w-full py-2 text-sm text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded border border-dashed border-slate-300 hover:border-indigo-300 transition-colors flex items-center justify-center gap-2">
                    <Plus size={14} /> Create Task
                </button>
              </div>
            </div>
          );
        })}
        
        {/* "Blank Board" placeholder/add column */}
        <div className="w-80 flex-shrink-0 h-full flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 hover:border-slate-300 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
            <div className="text-center">
                <Plus size={32} className="mx-auto mb-2" />
                <span className="font-medium">Add Section</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;

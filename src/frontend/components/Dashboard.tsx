'use client';

import React from 'react';
import { TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface DashboardProps {
  stats: {
    totalTasks: number;
    inProgress: number;
    urgent: number;
    teamMembers: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const statsDisplay = [
    { label: 'Total Tasks', value: stats.totalTasks.toString(), icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'In Progress', value: stats.inProgress.toString(), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Urgent', value: stats.urgent.toString(), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Team Members', value: stats.teamMembers.toString(), icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="flex-1 p-8 bg-white h-full overflow-y-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Good Morning, Alex! 👋</h1>
      <p className="text-slate-500 mb-8">Here is what's happening with Project Alpha today.</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsDisplay.map((stat, idx) => {
           const Icon = stat.icon;
           return (
             <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-center justify-between mb-4">
                 <div className={`${stat.bg} p-3 rounded-lg`}>
                   <Icon size={24} className={stat.color} />
                 </div>
                 <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
               </div>
               <h3 className="text-sm font-medium text-slate-500">{stat.label}</h3>
             </div>
           )
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                <img src={`https://picsum.photos/32/32?random=${i}`} className="w-8 h-8 rounded-full" alt={`User ${i}`} />
                <div>
                   <p className="text-sm text-slate-800"><span className="font-semibold">User {i}</span> moved task <span className="font-medium text-indigo-600">Update API Docs</span> to <span className="italic">In Progress</span></p>
                   <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
           <h2 className="text-xl font-bold mb-2">Project Status</h2>
           <div className="w-full bg-white/20 h-2 rounded-full mb-6">
             <div className="bg-white h-2 rounded-full w-[75%]"></div>
           </div>
           <p className="text-indigo-100 text-sm mb-6">75% of tasks completed for the upcoming Sprint release.</p>
           <button className="w-full py-2 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
             View Details
           </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import React from 'react';
import { Layers, Zap, Layout, Users, Calendar, ListTodo } from 'lucide-react';

const features = [
  {
    icon: <Layers className="text-indigo-600" size={24} />,
    title: "Unified Workspace",
    description: "Keep all your tasks and documents in one place. Simple and organized."
  },
  {
    icon: <Zap className="text-indigo-600" size={24} />,
    title: "Real-time Sync",
    description: "See updates instantly. When a teammate moves a task, you see it happen."
  },
  {
    icon: <Layout className="text-indigo-600" size={24} />,
    title: "Visual Boards",
    description: "Plan your work with simple Kanban boards. Drag and drop to track progress."
  },
  {
    icon: <Users className="text-indigo-600" size={24} />,
    title: "Team Collaboration",
    description: "Comment, tag, and assign tasks to your team members easily."
  },
  {
    icon: <Calendar className="text-indigo-600" size={24} />,
    title: "Shared Calendar",
    description: "View all deadlines and milestones in a single, easy-to-read calendar view."
  },
  {
    icon: <ListTodo className="text-indigo-600" size={24} />,
    title: "Workflow Tracking",
    description: "Customize statuses like 'To Do', 'In Progress', and 'Done' to match how you work."
  }
];

const Features: React.FC = () => {
  return (
    <div id="features" className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Features</h2>
          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Essential tools for your team</p>
          <p className="mt-4 text-lg text-slate-500 font-light">
            Everything you need to manage projects without the complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <div className="group-hover:text-white text-indigo-600 transition-colors">
                    {React.cloneElement(feature.icon as React.ReactElement<{ className?: string }>, { className: "currentColor" })}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;

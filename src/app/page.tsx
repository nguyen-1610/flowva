import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6">
      {/* Header / Nav simulation */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Flowva</span>
        </div>
      </div>

      <div className="max-w-4xl w-full text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Welcome back, <span className="text-indigo-600 relative inline-block">
            Alex.
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-400 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </span>
        </h1>
        <p className="text-xl text-slate-500 font-medium">Pick up where you left off in Flowva</p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider">Your Recent Projects</h2>
            <button className="text-indigo-600 font-semibold text-sm hover:underline">Create a new site</button>
          </div>

          <div className="space-y-4">
            {/* Project Card */}
            <Link href="/dashboard" className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-slate-50 hover:bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                  <span className="font-bold text-lg">PA</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Project Alpha</h3>
                  <p className="text-sm text-slate-500">Software Development • jira.flowva.com</p>
                </div>
              </div>
              
              <span className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors transform group-hover:translate-x-1 duration-200">
                Go to Project <ArrowRight size={16} />
              </span>
            </Link>

             {/* Secondary Project (Disabled/Mock) */}
             <div className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-300 transition-all cursor-not-allowed opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                  <span className="font-bold text-lg">MK</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-800">Marketing Q4</h3>
                  <p className="text-sm text-slate-500">Marketing • marketing.flowva.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex justify-between items-center">
            <div className="flex gap-4">
                 <span className="text-slate-400 text-sm flex items-center gap-1"><Layers size={14}/> 5 Projects</span>
            </div>
            <button className="text-slate-500 text-sm font-medium hover:text-slate-800">Explore features</button>
        </div>
      </div>
      
      {/* Decorative doodles */}
      <div className="absolute bottom-10 right-10 opacity-20 pointer-events-none">
         <svg width="200" height="200" viewBox="0 0 200 200">
            <path d="M40,160 Q 100,10 160,160" stroke="#4f46e5" strokeWidth="4" fill="none" />
            <circle cx="20" cy="40" r="10" fill="#fbbf24" />
            <rect x="150" y="20" width="20" height="20" fill="#ec4899" transform="rotate(20 160 30)" />
         </svg>
      </div>
    </div>
  );
}


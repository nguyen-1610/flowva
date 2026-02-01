import React from 'react';
import { Zap, Twitter, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center text-white">
                <Zap size={14} fill="currentColor" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">Flowva</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Making work flow better for everyone, everywhere. The operating system for modern business.
            </p>
            <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Twitter size={20} /></a>
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Linkedin size={20} /></a>
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Github size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Flowva Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-slate-400 font-medium">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

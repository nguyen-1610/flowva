'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getMockAvatar } from '@/frontend/lib/avatar-utils';
import {
  Search,
  Bell,
  Settings,
  ChevronDown,
  Layout,
  Calendar,
  MessageSquare,
  Layers,
  LogOut,
  User as UserIcon,
  Loader2,
} from 'lucide-react';
import { ViewType } from '@/shared/types/ui-types';
import { logout } from '@/frontend/features/auth/actions';
// import { User } from '@/shared/types/ui-types';
// Use ViewType for navigation, but we might want real navigation via Link soon.
// For now, adhering to the prop-based navigation to match the current structure request,
// but will likely switch to real routing later.

interface TopNavigationProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
  user?: { name: string; email: string; avatar: string };
}

const TopNavigation: React.FC<{ user?: { name: string; email: string; avatar: string } }> = ({
  user,
}) => {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Layout },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/chat', label: 'Team Chat', icon: MessageSquare },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname.startsWith('/dashboard');
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-4 shadow-sm">
      {/* LEFT: Brand */}
      <Link
        href="/dashboard"
        className="mr-2 flex shrink-0 cursor-pointer items-center gap-2 lg:mr-4 lg:w-48 lg:pl-2"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">
          F
        </div>
        <span className="hidden text-xl font-bold tracking-tight text-slate-800 sm:inline">
          Flowva
        </span>
      </Link>

      {/* CENTER-LEFT: Main Navigation */}
      <nav className="mr-auto flex items-center gap-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium whitespace-nowrap transition-all lg:gap-2 lg:px-4 ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={18} className={active ? 'text-indigo-600' : 'text-slate-400'} />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* SEARCH: Positioned slightly to the right. "Vũ khí mạnh" styling. */}
      <div className="relative mx-2 hidden w-full max-w-md md:block lg:mx-4">
        <div className="group relative">
          <Search
            className="absolute top-2.5 left-3 text-slate-400 transition-colors group-focus-within:text-indigo-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search tasks, messages, files..."
            className="w-full rounded-full border border-transparent bg-slate-100 py-2 pr-4 pl-10 text-sm text-slate-700 shadow-sm transition-all outline-none placeholder:text-slate-400 hover:border-slate-200 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          {/* Tooltip hint for "Power User" feature */}
          <div className="pointer-events-none absolute top-2.5 right-3 hidden group-focus-within:block">
            <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              ⌘ K
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: Project, Notifications, Profile */}
      <div className="ml-auto flex w-auto shrink-0 items-center justify-end gap-2 sm:ml-0 lg:gap-3">
        {/* Project Switcher */}
        <div className="mr-4 hidden cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 transition-colors hover:border-slate-300 hover:bg-white xl:flex">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-600">
            <Layers size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs leading-none font-bold text-slate-700">Project Alpha</span>
            <span className="mt-0.5 text-[10px] leading-none text-slate-500">Software Dev</span>
          </div>
          <ChevronDown size={14} className="ml-2 text-slate-400" />
        </div>

        <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block"></div>

        <button className="relative cursor-pointer rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full border border-white bg-red-500"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            className={`ml-1 flex cursor-pointer items-center gap-2 rounded-full border p-1 pl-1 transition-colors ${isProfileOpen ? 'border-indigo-100 bg-indigo-50' : 'border-transparent hover:border-slate-200 hover:bg-slate-50'}`}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <Image
              src={user?.avatar || getMockAvatar(user?.name || 'User')}
              alt="Profile"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border border-slate-200"
            />
            <ChevronDown
              size={14}
              className={`mr-1 hidden text-slate-400 transition-transform sm:block ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <>
              {/* Backdrop to close on click outside */}
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>

              <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-xl duration-200">
                <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3">
                  <p className="text-sm font-bold text-slate-800">{user?.name || 'User'}</p>
                  <p className="truncate text-xs text-slate-500">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>

                <div className="p-1">
                  <button className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                    <UserIcon size={16} className="text-slate-400" /> Profile
                  </button>
                  {/* Settings moved here */}
                  <button
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    onClick={() => {
                      // Navigate to settings (future)
                      setIsProfileOpen(false);
                    }}
                  >
                    <Settings size={16} className="text-slate-400" /> Settings
                  </button>
                </div>

                <div className="my-1 border-t border-slate-100"></div>

                <div className="p-1">
                  <button
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    onClick={handleLogout}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <LogOut size={16} />
                    )}
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;

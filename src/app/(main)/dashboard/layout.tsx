import React from 'react';
import { createClient } from '@/backend/lib/supabase/server';
import Sidebar from '@/frontend/features/dashboard/components/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // User check handled in parent layout, but data needed for Sidebar
  const userData = user
    ? {
        name: user.user_metadata?.name || 'User',
        avatar: user.user_metadata?.avatar_url || 'https://picsum.photos/100/100',
      }
    : undefined;

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-100">
      <Sidebar user={userData} />
      <main className="relative -mt-px -ml-px flex h-full flex-1 flex-col overflow-hidden rounded-tl-2xl border-t border-l border-slate-200 bg-white shadow-xl">
        {/* The rounded-tl-2xl and borders mimic the "card" look from the template if sidebar is outside */}
        {/* Actually Sidebar is full height, main content is next to it. 
             Template style: Sidebar is flat, Content is "paper" if needed or flat.
             Let's inspect Template Dashboard structure.
             Template App.tsx: 
             <div className="flex h-screen ..."> <Sidebar /> <main ...> <Dashboard /> </main> </div>
             
             In Sidebar.tsx (migrated): it has `border-r`.
             
             So layout should be flex.
             I'll stick to a simple flex row.
          */}
        {children}
      </main>
    </div>
  );
}

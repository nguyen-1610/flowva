import React from 'react';
import { createSupabaseServerClient } from '@/backend/lib/supabase/server';
import Sidebar from '@/frontend/components/Sidebar';
import { getMockAvatar } from '@/frontend/lib/avatar-utils';

import { CurrentUser } from '@/shared/types/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // User check handled in parent layout, but data needed for Sidebar
  const userData: CurrentUser = user
    ? {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: user.user_metadata?.avatar_url || getMockAvatar(user.user_metadata?.name || 'User'),
      }
    : {
        id: '',
        name: 'Guest',
        email: '',
        avatar: getMockAvatar('Guest'),
      };

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-100">
      <Sidebar user={userData} />
      <main className="relative -mt-px -ml-px flex h-full flex-1 flex-col overflow-hidden rounded-tl-2xl border-t border-l border-slate-200 bg-white shadow-xl">
        {children}
      </main>
    </div>
  );
}


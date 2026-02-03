import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/backend/lib/supabase/server';
import TopNavigation from '@/frontend/features/dashboard/components/TopNavigation';
import { getMockAvatar } from '@/frontend/lib/avatar-utils';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const userData = {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    avatar: user.user_metadata?.avatar_url || getMockAvatar(user.email || 'User'),
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50">
      <TopNavigation user={userData} />
      <div className="relative flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

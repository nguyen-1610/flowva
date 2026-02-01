import React from 'react';
import { createClient } from '@/backend/lib/supabase/server';
import ProjectOverview from '@/frontend/features/dashboard/components/ProjectOverview';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userData = user
    ? {
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        avatar: user.user_metadata?.avatar_url || 'https://picsum.photos/100/100',
      }
    : undefined;

  return <ProjectOverview user={userData} />;
}

import React from 'react';
import { createSupabaseServerClient } from '@/backend/lib/supabase/server';
import ProjectOverview from '@/frontend/features/dashboard/components/ProjectOverview';
import { getMockAvatar } from '@/frontend/lib/avatar-utils';

import { CurrentUser } from '@/shared/types/auth';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userData: CurrentUser | undefined = user
    ? {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: user.user_metadata?.avatar_url || getMockAvatar(user.email || 'User'),
      }
    : undefined;

  return <ProjectOverview user={userData} />;
}

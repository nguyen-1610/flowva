// src/app/projects/page.tsx - ĐÚNG
// Lỗi: Vẫn dùng getSession() → đổi sang getUser()

import React from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/backend/lib/supabase/server';
import ProjectSelectorWrapper from '@/frontend/features/dashboard/components/ProjectSelectorWrapper';

export default async function ProjectsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userName = user.user_metadata.name || user.email?.split('@')[0] || 'User';

  return <ProjectSelectorWrapper userName={userName} />;
}

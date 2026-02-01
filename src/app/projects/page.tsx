// src/app/projects/page.tsx - ĐÚNG
// Lỗi: Vẫn dùng getSession() → đổi sang getUser()

import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/backend/lib/supabase/server';
import ProjectSelectorWrapper from '@/frontend/features/dashboard/components/ProjectSelectorWrapper';

export default async function ProjectsPage() {
  const supabase = await createClient();

  // ← FIX: Đổi getSession() sang getUser()
  const { data: { user }, error } = await supabase.auth.getUser();

  console.log('ProjectsPage: User check:', { hasUser: !!user, email: user?.email });

  if (error || !user) {
    redirect('/login');
  }

  return <ProjectSelectorWrapper />;
}
import React from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/backend/lib/supabase/server';
import { ProjectService } from '@/backend/services/project.service';
import ProjectSelectorWrapper from '@/frontend/features/projects/components/ProjectSelectorWrapper';
import type { ProjectDTO } from '@/shared/types/project';

export default async function ProjectsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';

  // Lấy danh sách projects trực tiếp từ Service (Server Component)
  let projects: ProjectDTO[] = [];
  try {
    projects = (await ProjectService.getList()) as ProjectDTO[];
  } catch {
    // Nếu lỗi thì hiển thị danh sách rỗng, không crash page
    projects = [];
  }

  return <ProjectSelectorWrapper userName={userName} projects={projects} />;
}

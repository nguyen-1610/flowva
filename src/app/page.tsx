import React from 'react';
import LandingPage from '@/frontend/features/landing/components/LandingPage';
import ProjectSelectorWrapper from '@/frontend/features/dashboard/components/ProjectSelectorWrapper';
import { createClient } from '@/backend/lib/supabase/server';

export default async function RootPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
  }

  return <ProjectSelectorWrapper />;
}

import React from 'react';
import { redirect } from 'next/navigation';
import LandingPage from '@/frontend/features/landing/components/LandingPage';
import { createSupabaseServerClient } from '@/backend/lib/supabase/server';

export default async function RootPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('RootPage User Check:', user ? 'Authenticated' : 'No User');

  if (user) {
    redirect('/projects');
  }

  return <LandingPage />;
}

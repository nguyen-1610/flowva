import React from 'react';
import { redirect } from 'next/navigation';
import LandingPage from '@/frontend/features/landing/components/LandingPage';
import { createSupabaseServerClient } from '@/backend/lib/supabase/server';

export default async function RootPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('RootPage Session Check:', session ? 'Authenticated' : 'No Session');

  if (session) {
    redirect('/projects');
  }

  return <LandingPage />;
}

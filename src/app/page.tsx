'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '@/frontend/features/landing/components/LandingPage';
import { createClient } from '@/backend/lib/supabase/client';

export default function RootPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Client-side auth check for the landing interaction
  // Ideally this is server-side via middleware or server component redirect,
  // but since we want to render the LandingPage component which might need client interactivity...
  // Actually, we can just render it. If user not logged in, they should've been redirected by middleware or server logic.
  // But let's assume we are safe here or do a quick check.

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/auth/login');
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <LandingPage onSelectProject={() => router.push('/dashboard')} />;
}

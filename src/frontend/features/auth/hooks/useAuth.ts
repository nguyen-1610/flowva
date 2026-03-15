'use client';

import { useState } from 'react';
import { createClient } from '@/backend/lib/supabase/client';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/callback?next=/projects`,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  const signInWithGithub = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/callback?next=/projects`,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error('Github sign in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in with Github');
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    signInWithGithub,
    signOut,
    isLoading,
    error,
  };
}

'use server';

import { createClient } from '@/backend/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { LoginSchema, SignupSchema, type AuthResponse } from '@/shared/types/auth';
import { z } from 'zod';

export async function login(prevState: any, formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validate input
  const validation = LoginSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0].message,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(prevState: any, formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const name = formData.get('name') as string;

  // Validate input
  const validation = SignupSchema.safeParse({ email, password, confirmPassword, name });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0].message,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  // Usually signup needs email verification or auto-login
  // For now, redirect to a verification page or login
  return {
    success: true,
    data: { message: 'Kiểm tra email để xác thực tài khoản' },
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    console.error('Google login error:', error);
    redirect('/login?error=GoogleLoginFailed');
  }

  if (data.url) {
    redirect(data.url);
  }
}

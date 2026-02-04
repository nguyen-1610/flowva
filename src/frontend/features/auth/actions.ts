'use server';

import { createSupabaseServerClient } from '@/backend/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { LoginSchema, SignupSchema, type AuthResponse } from '@/shared/types/auth';

export async function login(
  prevState: AuthResponse | null,
  formData: FormData,
): Promise<AuthResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = LoginSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0].message,
    };
  }

  const supabase = await createSupabaseServerClient();

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
  redirect('/projects');
}

export async function signup(
  prevState: AuthResponse | null,
  formData: FormData,
): Promise<AuthResponse> {
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

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
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

  // Nếu Supabase trả về session (Email Confirm tắt), ta login luôn
  if (data.session) {
    revalidatePath('/', 'layout');
    redirect('/projects');
  }

  // Nếu không có session (cần verify email)
  return {
    success: true,
    data: { message: 'Kiểm tra email để xác thực tài khoản' },
  };
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

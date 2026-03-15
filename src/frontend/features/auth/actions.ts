'use server';

import { AuthService } from '@/backend/services/auth.service';
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

  try {
    // Use AuthService instead of direct Supabase call
    await AuthService.login(email, password);
    
    revalidatePath('/', 'layout');
    redirect('/projects');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
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

  try {
    // Use AuthService instead of direct Supabase call
    const { session } = await AuthService.signup(email, password, name);
    
    // Nếu Supabase trả về session (Email Confirm tắt), ta login luôn
    if (session) {
      revalidatePath('/', 'layout');
      redirect('/projects');
    }

    // Nếu không có session (cần verify email)
    return {
      success: true,
      data: { message: 'Kiểm tra email để xác thực tài khoản' },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Signup failed',
    };
  }
}

export async function logout() {
  try {
    // Use AuthService instead of direct Supabase call
    await AuthService.logout();
    
    revalidatePath('/', 'layout');
    redirect('/login');
  } catch (error) {
    console.error('Logout error:', error);
    // Still redirect even if logout fails
    redirect('/login');
  }
}

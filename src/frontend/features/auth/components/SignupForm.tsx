'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signup, loginWithGoogle } from '@/frontend/features/auth/actions';
import { SignupSchema, type SignupInput } from '@/shared/types/auth';
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitSuccessful },
  } = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = (data: SignupInput) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);
      if (data.name) formData.append('name', data.name);

      const result = await signup(null, formData);
      if (result && !result.success && result.error) {
        setError('root', { message: result.error });
      }
    });
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  if (isSubmitSuccessful) {
    return (
      <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center shadow-xl backdrop-blur-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-white">Check your email</h2>
        <p className="text-zinc-400">
          We&apos;ve sent a confirmation link to your email address. Please click the link to
          activate your account.
        </p>
        <Link
          href="/login"
          className="inline-block w-full rounded-lg bg-zinc-800 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-xl">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter text-white">Create Account</h1>
        <p className="text-zinc-400">Join Flowva to manage your tasks efficiently</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Full Name</label>
          <div className="relative">
            <User className="absolute top-2.5 left-3 h-4 w-4 text-zinc-500" />
            <input
              {...register('name')}
              placeholder="John Doe"
              className="w-full rounded-lg border border-zinc-800 bg-black/40 py-2 pr-3 pl-9 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Email</label>
          <div className="relative">
            <Mail className="absolute top-2.5 left-3 h-4 w-4 text-zinc-500" />
            <input
              {...register('email')}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-zinc-800 bg-black/40 py-2 pr-3 pl-9 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <div className="relative">
              <Lock className="absolute top-2.5 left-3 h-4 w-4 text-zinc-500" />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-800 bg-black/40 py-2 pr-3 pl-9 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Confirm</label>
            <div className="relative">
              <Lock className="absolute top-2.5 left-3 h-4 w-4 text-zinc-500" />
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-800 bg-black/40 py-2 pr-3 pl-9 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-rose-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {errors.root && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-400">
            <AlertCircle className="h-4 w-4" />
            {errors.root.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-black/40 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
      </button>

      <p className="text-center text-sm text-zinc-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}

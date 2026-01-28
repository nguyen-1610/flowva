'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signup } from '@/frontend/features/auth/actions';
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

      <p className="text-center text-sm text-zinc-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}

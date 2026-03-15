'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectAction } from '@/frontend/features/projects/actions';
import { CreateProjectSchema, type CreateProjectInput } from '@/shared/types/project';
import { Loader2, AlertCircle, Layers, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

export default function CreateProjectForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(CreateProjectSchema),
  });

  const onSubmit = (data: CreateProjectInput) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);

      const result = await createProjectAction(formData);

      if (!result.success) {
        setError('root', { message: result.error });
        return;
      }

      // Thành công → về trang danh sách projects
      router.push('/projects');
    });
  };

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/20 ring-1 ring-indigo-500/30">
          <Layers className="h-7 w-7 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter text-white">New Project</h1>
        <p className="text-zinc-400">Set up your workspace and start collaborating</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Project Name */}
        <div className="space-y-2">
          <label htmlFor="project-name" className="text-sm font-medium text-zinc-300">
            Project Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Layers className="absolute top-2.5 left-3 h-4 w-4 text-zinc-500" />
            <input
              id="project-name"
              {...register('name')}
              placeholder="My Awesome Project"
              autoFocus
              className="w-full rounded-lg border border-zinc-800 bg-black/40 py-2 pr-3 pl-9 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
              disabled={isPending}
            />
          </div>
          {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="project-description" className="text-sm font-medium text-zinc-300">
            Description{' '}
            <span className="text-xs font-normal text-zinc-500">(optional)</span>
          </label>
          <div className="relative">
            <FileText className="absolute top-2.5 left-3 h-4 w-4 text-zinc-500" />
            <textarea
              id="project-description"
              {...register('description')}
              placeholder="Briefly describe what this project is about..."
              rows={3}
              className="w-full resize-none rounded-lg border border-zinc-800 bg-black/40 py-2 pr-3 pl-9 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
              disabled={isPending}
            />
          </div>
          {errors.description && (
            <p className="text-xs text-rose-500">{errors.description.message}</p>
          )}
        </div>

        {/* Root error (Server Action lỗi) */}
        {errors.root && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errors.root.message}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <Link
            href="/projects"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-700 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Cancel
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

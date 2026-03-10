import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/backend/lib/supabase/server';
import CreateProjectForm from '@/frontend/features/projects/components/CreateProjectForm';

export const metadata = {
  title: 'New Project — Flowva',
  description: 'Create a new project workspace',
};

export default async function NewProjectPage() {
  // Guard: chỉ user đã đăng nhập mới được vào
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-zinc-950 via-slate-900 to-zinc-950 p-6">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
          F
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Flowva</span>
      </div>

      <div className="w-full max-w-md">
        <CreateProjectForm />
      </div>
    </div>
  );
}

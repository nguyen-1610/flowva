'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Main app error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-200">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Application Error</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            {error.message || 'Something went wrong while processing your request. Please try again or return to the dashboard.'}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          
          <button
            onClick={reset}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/10 transition-all hover:bg-indigo-700 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
        
        {error.digest && (
          <p className="mt-4 font-mono text-[10px] text-slate-400">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}

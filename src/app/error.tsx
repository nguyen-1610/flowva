'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/30">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
          <p className="text-sm text-slate-400">
            We encountered an unexpected error. This has been logged and we're looking into it.
          </p>
        </div>

        {error.digest && (
          <div className="rounded-md bg-slate-800/50 p-2">
             <p className="font-mono text-[10px] text-slate-500">Error ID: {error.digest}</p>
          </div>
        )}

        <button
          onClick={reset}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98]"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}

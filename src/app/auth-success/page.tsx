// src/app/auth-success/page.tsx
'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function AuthSuccessContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/projects';

  useEffect(() => {
    // Đợi browser process Set-Cookie headers xong rồi mới redirect
    const timer = setTimeout(() => {
      window.location.href = next;
    }, 1000);

    return () => clearTimeout(timer);
  }, [next]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600"></div>
        <h2 className="mb-2 text-xl font-semibold text-gray-800">Đăng nhập thành công!</h2>
        <p className="text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600"></div>
          </div>
        </div>
      }
    >
      <AuthSuccessContent />
    </Suspense>
  );
}

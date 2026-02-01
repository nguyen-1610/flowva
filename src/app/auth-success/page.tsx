// src/app/auth-success/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthSuccessPage() {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Đăng nhập thành công!
        </h2>
        <p className="text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
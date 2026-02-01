import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/backend/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Update session như bình thường
  const response = await updateSession(request);
  
  // Fix CSP issues cho Google OAuth
  // Remove CSP headers that might block Google OAuth
  response.headers.delete('content-security-policy');
  response.headers.delete('content-security-policy-report-only');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

import { NextResponse } from 'next/server';
// 1. Import gói ssr trực tiếp thay vì dùng hàm share
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Nếu có tham số 'next' thì về đó, không thì về /projects
  const next = searchParams.get('next') ?? '/projects';

  if (code) {
    const cookieStore = await cookies();

    // 2. Tạo client trực tiếp ở đây để có full quyền set cookie
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {
              // Ở Route Handler, việc set cookie là BẮT BUỘC nên không được ignore lỗi
              console.error('Lỗi set cookie:', error);
            }
          },
        },
      }
    );

    // 3. Đổi code lấy session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 4. Dùng NextResponse.redirect thay vì redirect() của next/navigation
      // để đảm bảo cookie được gửi kèm trong header phản hồi
      const forwardedHost = request.headers.get('x-forwarded-host'); // Support deploy trên Vercel/Docker
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      if (isLocalEnv) {
        // Localhost thì cứ redirect thẳng
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // Môi trường deploy thật (xử lý https/http proxy)
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Nếu lỗi thì về trang lỗi
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
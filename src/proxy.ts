import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get('token')?.value;

  // Protected paths — wajib login
  const protectedPaths = ['/checkout', '/akun'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // Admin only
  const isAdmin = pathname.startsWith('/admin');

  // TODO: Decode JWT untuk cek role 'admin'. Sementara kita hanya cek keberadaan token.
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/masuk', req.url));
  }

  if (isAdmin && !token) {
    // Idealnya decode JWT dan periksa user.role === 'admin'
    return NextResponse.redirect(new URL('/masuk', req.url));
  }

  // Mencegah user yang sudah login mengakses halaman auth
  const authPaths = ['/masuk', '/daftar'];
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/akun/profil', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};

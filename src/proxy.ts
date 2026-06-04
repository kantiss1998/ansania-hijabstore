import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(payloadBase64);
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get('token')?.value;

  // Protected paths — wajib login
  const protectedPaths = ['/checkout', '/akun'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // Admin only
  const isAdmin = pathname.startsWith('/admin');

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/masuk', req.url));
  }

  if (isAdmin) {
    if (!token) {
      return NextResponse.redirect(new URL('/masuk', req.url));
    }
    const decoded = decodeJWT(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/masuk', req.url));
    }
  }

  // Mencegah user yang sudah login mengakses halaman auth
  const authPaths = ['/masuk', '/daftar'];
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  if (isAuthPage && token) {
    const decoded = decodeJWT(token);
    if (decoded?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.redirect(new URL('/akun/profil', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};

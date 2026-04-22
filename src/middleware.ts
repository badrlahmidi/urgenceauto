import createIntlMiddleware from 'next-intl/middleware';
import NextAuth from 'next-auth';
import authConfig from './lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

const handleI18nRouting = createIntlMiddleware({
  locales: ['fr', 'ar'],
  defaultLocale: 'fr'
});

export default auth((req: any) => {
  const { pathname } = req.nextUrl;

  // Protected routes matcher
  const isDashboard = pathname.includes('/dashboard');
  const isAdmin = pathname.includes('/admin');

  if ((isDashboard || isAdmin) && !req.auth) {
    const signInUrl = new URL('/login', req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isAdmin && req.auth?.user?.role !== 'ADMIN') {
    const unauthorizedUrl = new URL('/', req.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  if (isDashboard && req.auth?.user?.role !== 'PRO') {
    const unauthorizedUrl = new URL('/', req.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  return handleI18nRouting(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|ar)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};

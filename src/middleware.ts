import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  // Publika sidor
  const publicPaths = ['/', '/auth/login', '/auth/register'];
  const isPublicPath = publicPaths.includes(nextUrl.pathname);
  const isAuthPath = nextUrl.pathname.startsWith('/auth/');
  const isApiAuthPath = nextUrl.pathname.startsWith('/api/auth/');

  // API auth routes är alltid tillgängliga
  if (isApiAuthPath) {
    return NextResponse.next();
  }

  // Om inloggad och försöker nå auth-sidor, redirect till dashboard
  if (isLoggedIn && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  // Om inte inloggad och försöker nå skyddade sidor, redirect till login
  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/login', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

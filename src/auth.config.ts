import type { NextAuthConfig } from 'next-auth';

// Auth config utan providers (för proxy/edge)
// Providers definieras i auth.ts för server-side
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Publika sidor
      const publicPaths = ['/', '/auth/login', '/auth/register'];
      const isPublicPath = publicPaths.includes(nextUrl.pathname);
      const isAuthPath = nextUrl.pathname.startsWith('/auth/');
      const isApiAuthPath = nextUrl.pathname.startsWith('/api/auth/');

      // API auth routes är alltid tillgängliga
      if (isApiAuthPath) {
        return true;
      }

      // Om inloggad och försöker nå auth-sidor, redirect till dashboard
      if (isLoggedIn && isAuthPath) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // Om inte inloggad och försöker nå skyddade sidor, redirect till login
      if (!isLoggedIn && !isPublicPath) {
        return false; // NextAuth redirectar automatiskt till signIn page
      }

      return true;
    },
  },
  providers: [], // Providers läggs till i auth.ts
};

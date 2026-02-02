import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import type { NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

// Wrapper funktion för Next.js 16 proxy
export async function proxy(request: NextRequest) {
  return auth(request as any);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

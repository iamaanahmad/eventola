import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /dashboard, /login)
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/'];
  const isPublicPath = publicPaths.includes(path) || path.startsWith('/event/');

  // If accessing a protected route, check for authentication
  if (!isPublicPath && path.startsWith('/dashboard')) {
    // In a real implementation, you'd verify the session here
    // For now, we'll let the client-side auth handle it
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

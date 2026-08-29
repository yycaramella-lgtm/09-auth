import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

const matchesRoute = (
  pathname: string,
  routes: string[],
): boolean => {
  return routes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken =
    request.cookies.get('refreshToken')?.value;

  const isAuthenticated = Boolean(
    accessToken || refreshToken,
  );

  const isPrivateRoute = matchesRoute(
    pathname,
    privateRoutes,
  );

  const isPublicRoute = matchesRoute(
    pathname,
    publicRoutes,
  );

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(
      new URL('/sign-in', request.url),
    );
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(
      new URL('/profile', request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};
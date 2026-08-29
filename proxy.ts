import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';

import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

const matchesRoute = (
  pathname: string,
  routes: string[],
): boolean => {
  return routes.some(
    route =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPrivateRoute = matchesRoute(
    pathname,
    privateRoutes,
  );

  const isPublicRoute = matchesRoute(
    pathname,
    publicRoutes,
  );

  if (isPrivateRoute && !accessToken && !refreshToken) {
    return NextResponse.redirect(
      new URL('/sign-in', request.url),
    );
  }

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(
      new URL('/', request.url),
    );
  }

  if (!accessToken && refreshToken) {
    try {
      const response = await checkServerSession();

      const nextResponse =
        isPublicRoute && response.status === 200
          ? NextResponse.redirect(
              new URL('/', request.url),
            )
          : NextResponse.next();

      const setCookie = response.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie)
          ? setCookie
          : [setCookie];

        for (const cookieString of cookieArray) {
          const parsed = parseSetCookie(cookieString);

          if (parsed.value !== undefined) {
            nextResponse.cookies.set({
              name: parsed.name,
              value: parsed.value,
              httpOnly: parsed.httpOnly,
              secure: parsed.secure,
              sameSite: parsed.sameSite,
              path: parsed.path,
              maxAge: parsed.maxAge,
              expires: parsed.expires,
              domain: parsed.domain,
            });
          }
        }
      }

      if (isPrivateRoute && response.status !== 200) {
        return NextResponse.redirect(
          new URL('/sign-in', request.url),
        );
      }

      return nextResponse;
    } catch {
      if (isPrivateRoute) {
        return NextResponse.redirect(
          new URL('/sign-in', request.url),
        );
      }

      return NextResponse.next();
    }
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
import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_PATH = '/kr-control-7x4q';
const LOGIN_PATH = '/kr-control-7x4q/login';
const COOKIE_NAME = 'krea_admin';

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin pages
  if (pathname.startsWith(ADMIN_PATH) && pathname !== LOGIN_PATH) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!(await isValidSession(token))) {
      return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
    }
  }

  // If already logged in, kick away from login page
  if (pathname === LOGIN_PATH) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (await isValidSession(token)) {
      return NextResponse.redirect(new URL(ADMIN_PATH, req.url));
    }
  }

  // Don't expose admin in robots — done via headers (404-like obscurity)
  if (pathname.startsWith(ADMIN_PATH)) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/kr-control-7x4q/:path*']
};

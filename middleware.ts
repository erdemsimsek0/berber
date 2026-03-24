import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/isletme", "/admin", "/musteri"];

function hasSessionCookie(req: NextRequest) {
  const cookies = req.cookies.getAll();
  return cookies.some((cookie) => cookie.name.includes("sb-") && cookie.name.includes("auth-token"));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) return NextResponse.next();

  const demoBypass = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  if (demoBypass || hasSessionCookie(req)) return NextResponse.next();

  const loginUrl = new URL("/giris", req.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/isletme/:path*", "/admin/:path*", "/musteri/:path*"]
};

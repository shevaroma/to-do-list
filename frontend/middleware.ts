import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-cookie";

export const config = {
  matcher: [
    "/((?!_next/image|_next/static|api|favicon.ico|forgot-password|reset-password|robots.txt|sign-in|sign-up|sitemap.xml).*)",
  ],
};

// Only checks expiry; the backend verifies the signature on every request.
const isTokenFresh = (token: string | undefined) => {
  if (!token) return false;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === "number" && exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const middleware = async (request: NextRequest) => {
  if (isTokenFresh(request.cookies.get(ACCESS_TOKEN_COOKIE)?.value)) {
    return NextResponse.next();
  }
  const response = NextResponse.redirect(new URL("/sign-in", request.url));
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  return response;
};

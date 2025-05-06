import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!_next/image|_next/static|api|favicon.ico|forgot-password|reset-password|robots.txt|sign-in|sign-up|sitemap.xml).*)",
  ],
};

export const middleware = async (request: NextRequest) =>
  request.cookies.get("access_token") !== undefined
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/sign-in", request.url));

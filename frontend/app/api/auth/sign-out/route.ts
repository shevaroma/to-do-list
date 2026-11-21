import { NextResponse } from "next/server";
import { expiredAccessTokenCookie } from "@/lib/auth-cookie";

export const POST = async () => {
  const nextResponse = NextResponse.json({});
  nextResponse.cookies.set(expiredAccessTokenCookie());
  return nextResponse;
};

import { NextResponse } from "next/server";
import { toClientResponse } from "@/lib/proxy-response";
import { accessTokenCookie } from "@/lib/auth-cookie";

export const POST = async (request: Request) => {
  const { email, password } = await request.json();
  const response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) return toClientResponse(response);
  const nextResponse = NextResponse.json({});
  nextResponse.cookies.set(
    accessTokenCookie((await response.json()).access_token),
  );
  return nextResponse;
};

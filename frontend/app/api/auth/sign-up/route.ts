import { NextResponse } from "next/server";
import { toClientResponse } from "@/lib/proxy-response";
import { accessTokenCookie } from "@/lib/auth-cookie";

export const POST = async (request: Request) => {
  const { displayName, email, password } = await request.json();
  const response = await fetch(`${process.env.API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      display_name: displayName,
      password,
    }),
  });
  if (!response.ok) return toClientResponse(response);
  const nextResponse = NextResponse.json({});
  nextResponse.cookies.set(
    accessTokenCookie((await response.json()).access_token),
  );
  return nextResponse;
};

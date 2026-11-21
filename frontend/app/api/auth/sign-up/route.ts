import { NextResponse } from "next/server";
import { toClientResponse } from "@/lib/proxy-response";
import { accessTokenCookie } from "@/lib/auth-cookie";
import { backendFetch } from "@/lib/backend";

export const POST = async (request: Request) => {
  const { displayName, email, password } = await request.json();
  const response = await backendFetch("/auth/register", {
    method: "POST",
    json: {
      email,
      display_name: displayName,
      password,
    },
  });
  if (!response.ok) return toClientResponse(response);
  const nextResponse = NextResponse.json({});
  nextResponse.cookies.set(
    accessTokenCookie((await response.json()).access_token),
  );
  return nextResponse;
};

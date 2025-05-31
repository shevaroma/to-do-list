import { NextResponse } from "next/server";

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
  if (!response.ok) return response;
  const nextResponse = NextResponse.json({});
  nextResponse.cookies.set({
    name: "access_token",
    value: (await response.json()).access_token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600,
    path: "/",
  });
  return nextResponse;
};

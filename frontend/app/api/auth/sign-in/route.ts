import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { email, password } = await request.json();
  const response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
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

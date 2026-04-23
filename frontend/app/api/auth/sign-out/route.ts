import { NextResponse } from "next/server";

export const POST = async () => {
  const nextResponse = NextResponse.json({});
  nextResponse.cookies.set({
    name: "access_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });
  return nextResponse;
};

export const ACCESS_TOKEN_COOKIE = "access_token";

export const accessTokenCookie = (value: string) => ({
  name: ACCESS_TOKEN_COOKIE,
  value,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 3600,
  path: "/",
});

export const expiredAccessTokenCookie = () => ({
  ...accessTokenCookie(""),
  maxAge: 0,
  expires: new Date(0),
});

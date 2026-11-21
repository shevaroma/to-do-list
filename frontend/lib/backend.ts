import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-cookie";
import { toClientResponse } from "@/lib/proxy-response";

export const backendFetch = async (
  path: string,
  { json, ...init }: RequestInit & { json?: unknown } = {},
): Promise<Response> => {
  const headers = new Headers(init.headers);
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (json !== undefined) headers.set("Content-Type", "application/json");
  return fetch(`${process.env.API_BASE_URL}${path}`, {
    ...init,
    headers,
    body: json === undefined ? init.body : JSON.stringify(json),
  });
};

export const proxyToBackend = async (
  path: string,
  init?: RequestInit & { json?: unknown },
) => toClientResponse(await backendFetch(path, init));

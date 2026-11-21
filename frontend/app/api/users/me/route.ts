import { cookies } from "next/headers";
import { accessTokenCookie } from "@/lib/auth-cookie";
import { backendFetch, proxyToBackend } from "@/lib/backend";
import { toClientResponse } from "@/lib/proxy-response";

export const GET = async () => proxyToBackend("/users/me");

export const PUT = async (request: Request) => {
  const { display_name, email, password, current_password } =
    await request.json();
  const res = await backendFetch("/users/me", {
    method: "PUT",
    json: { email, display_name, password, current_password },
  });
  if (!res.ok) return toClientResponse(res);

  const data = await res.json();
  if (data.access_token) {
    (await cookies()).set(accessTokenCookie(data.access_token));
  }
  return Response.json(data, { status: res.status });
};

export const DELETE = async () =>
  proxyToBackend("/users/me", { method: "DELETE" });

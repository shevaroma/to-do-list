import { proxyToBackend } from "@/lib/backend";

export const POST = async (request: Request) =>
  proxyToBackend("/auth/reset-password", {
    method: "POST",
    json: { email: (await request.json()).email },
  });

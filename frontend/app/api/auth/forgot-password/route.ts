import { toClientResponse } from "@/lib/proxy-response";

export const POST = async (request: Request) =>
  toClientResponse(
    await fetch(`${process.env.API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: (await request.json()).email }),
    }),
  );

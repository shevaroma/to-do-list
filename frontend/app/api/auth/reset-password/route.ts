import { proxyToBackend } from "@/lib/backend";

export const POST = async (request: Request) => {
  const { token, newPassword } = await request.json();
  return proxyToBackend("/auth/reset-confirm", {
    method: "POST",
    json: { token, new_password: newPassword },
  });
};

export const POST = async (request: Request) =>
  fetch(`${process.env.API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: (await request.json()).email }),
  });

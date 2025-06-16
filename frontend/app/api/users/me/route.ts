import { cookies } from "next/headers";

export const GET = async () =>
  fetch(`${process.env.API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
    },
  });

export const PUT = async (request: Request) => {
  const { display_name, email, password, current_password } =
    await request.json();
  const res = await fetch(`${process.env.API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
    },
    body: JSON.stringify({
      email,
      display_name,
      password,
      current_password,
    }),
  });
  const data = await res.json();
  if (data.access_token) {
    (await cookies()).set("access_token", data.access_token, { path: "/" });
  }
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE = async () =>
  fetch(`${process.env.API_BASE_URL}/users/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
    },
  });

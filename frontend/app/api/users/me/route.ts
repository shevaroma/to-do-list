import { cookies } from "next/headers";

export const GET = async () =>
  fetch(`${process.env.API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
    },
  });

export const PUT = async (request: Request) => {
  const { displayName, email, password } = await request.json();
  return fetch(`${process.env.API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
    },
    body: JSON.stringify({
      email,
      display_name: displayName,
      password,
    }),
  });
};

export const DELETE = async () =>
  fetch(`${process.env.API_BASE_URL}/users/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
    },
  });

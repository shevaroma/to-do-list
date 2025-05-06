import { cookies } from "next/headers";

export const GET = async () =>
  fetch(`${process.env.API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
    },
  });

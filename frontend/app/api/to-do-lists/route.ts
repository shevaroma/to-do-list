import { cookies } from "next/headers";

export const DELETE = async (request: Request) =>
  fetch(`${process.env.API_BASE_URL}/todo-lists/${(await request.json()).id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
    },
  });

export const GET = async () =>
  fetch(`${process.env.API_BASE_URL}/todo-lists`, {
    headers: {
      Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
    },
  });

export const POST = async (request: Request) =>
  fetch(`${process.env.API_BASE_URL}/todo-lists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
    },
    body: JSON.stringify({ title: (await request.json()).name }),
  });

export const PUT = async (request: Request) => {
  const { id, name } = await request.json();
  return fetch(`${process.env.API_BASE_URL}/todo-lists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
    },
    body: JSON.stringify({ list_id: id, title: name }),
  });
};

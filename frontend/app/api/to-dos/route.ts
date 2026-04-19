import { cookies } from "next/headers";
import { toClientResponse } from "@/lib/proxy-response";

export const GET = async (request: Request) => {
  const searchParams = `${new URL(request.url).searchParams}`;
  return toClientResponse(
    await fetch(
      `${process.env.API_BASE_URL}/todos${searchParams.length !== 0 ? `?${searchParams}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
        },
      },
    ),
  );
};

export const POST = async (request: Request) => {
  const { title, description, due_date, priority, todo_list_id } =
    await request.json();
  return toClientResponse(
    await fetch(`${process.env.API_BASE_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
      },
      body: JSON.stringify({
        title,
        description: description ?? null,
        due_date: due_date ?? null,
        priority: priority ?? null,
        todo_list_id: todo_list_id ?? null,
      }),
    }),
  );
};

export const PUT = async (request: Request) => {
  const {
    id,
    title,
    description,
    due_date,
    priority,
    is_completed,
    todo_list_id,
  } = await request.json();
  return toClientResponse(
    await fetch(`${process.env.API_BASE_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
      },
      body: JSON.stringify({
        id,
        title,
        description: description ?? null,
        due_date: due_date ?? null,
        priority: priority ?? null,
        is_completed: is_completed ?? null,
        todo_list_id: todo_list_id ?? null,
      }),
    }),
  );
};

export const DELETE = async (request: Request) => {
  const { id, completed, todo_list_id } = await request.json();

  const url = completed
    ? `${process.env.API_BASE_URL}/todos/completed${todo_list_id ? `?todo_list_id=${todo_list_id}` : ""}`
    : `${process.env.API_BASE_URL}/todos/${id}`;

  return toClientResponse(
    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
      },
    }),
  );
};

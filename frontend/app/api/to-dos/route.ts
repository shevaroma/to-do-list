import { proxyToBackend } from "@/lib/backend";

export const GET = async (request: Request) => {
  const searchParams = `${new URL(request.url).searchParams}`;
  return proxyToBackend(
    `/todos${searchParams.length !== 0 ? `?${searchParams}` : ""}`,
  );
};

export const POST = async (request: Request) => {
  const { title, description, due_date, priority, todo_list_id } =
    await request.json();
  return proxyToBackend("/todos", {
    method: "POST",
    json: {
      title,
      description: description ?? null,
      due_date: due_date ?? null,
      priority: priority ?? null,
      todo_list_id: todo_list_id ?? null,
    },
  });
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
  return proxyToBackend(`/todos/${id}`, {
    method: "PUT",
    json: {
      title,
      description: description ?? null,
      due_date: due_date ?? null,
      priority: priority ?? null,
      is_completed: is_completed ?? null,
      todo_list_id: todo_list_id ?? null,
    },
  });
};

export const DELETE = async (request: Request) => {
  const { id, completed, todo_list_id } = await request.json();
  return proxyToBackend(
    completed
      ? `/todos/completed${todo_list_id ? `?todo_list_id=${todo_list_id}` : ""}`
      : `/todos/${id}`,
    { method: "DELETE" },
  );
};

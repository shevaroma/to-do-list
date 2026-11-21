import { proxyToBackend } from "@/lib/backend";

export const GET = async () => proxyToBackend("/todo-lists");

export const POST = async (request: Request) =>
  proxyToBackend("/todo-lists", {
    method: "POST",
    json: { title: (await request.json()).name },
  });

export const PUT = async (request: Request) => {
  const { id, name } = await request.json();
  return proxyToBackend(`/todo-lists/${id}`, {
    method: "PUT",
    json: { title: name },
  });
};

export const DELETE = async (request: Request) =>
  proxyToBackend(`/todo-lists/${(await request.json()).id}`, {
    method: "DELETE",
  });

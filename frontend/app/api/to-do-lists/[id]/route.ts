import { proxyToBackend } from "@/lib/backend";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) => proxyToBackend(`/todo-lists/${(await params).id}`);

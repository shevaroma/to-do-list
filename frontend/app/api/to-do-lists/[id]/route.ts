import { cookies } from "next/headers";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  return fetch(`${process.env.API_BASE_URL}/todo-lists/${id}`, {
    headers: {
      Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
    },
  });
};

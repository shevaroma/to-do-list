import { cookies } from "next/headers";

export const GET = async (
  _request: Request,
  { params }: { params: { id: string } },
) => {
  return fetch(`${process.env.API_BASE_URL}/todo-lists/${params.id}`, {
    headers: {
      Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
    },
  });
};

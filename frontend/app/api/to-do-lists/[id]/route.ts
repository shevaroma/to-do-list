import { cookies } from "next/headers";
import { toClientResponse } from "@/lib/proxy-response";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  return toClientResponse(
    await fetch(`${process.env.API_BASE_URL}/todo-lists/${id}`, {
      headers: {
        Authorization: `Bearer ${(await cookies()).get("access_token")?.value}`,
      },
    }),
  );
};

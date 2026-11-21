import ToDoListError from "@/lib/to-do-list-error";

export class ApiError extends Error {
  readonly status: number | null;

  constructor(status: number | null, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const isUnauthorized = (error: unknown) =>
  error instanceof ApiError && error.status === 401;

export const apiFetch = async <T = void>(
  path: string,
  { json, ...init }: RequestInit & { json?: unknown } = {},
): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(
      path,
      json === undefined
        ? init
        : {
            ...init,
            headers: { "Content-Type": "application/json", ...init.headers },
            body: JSON.stringify(json),
          },
    );
  } catch {
    throw new ApiError(null, "No connection.");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      typeof data?.detail === "string" ? data.detail : "Something went wrong.",
    );
  }

  const text = await response.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
};

export const toToDoListError = (error: Error | null) => {
  if (!error) return undefined;
  return error instanceof ApiError && error.status === null
    ? ToDoListError.NoConnection
    : ToDoListError.Unknown;
};

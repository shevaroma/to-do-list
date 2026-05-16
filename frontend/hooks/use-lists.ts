import { toast } from "sonner";
import List from "@/lib/list";
import ToDoListError from "@/lib/to-do-list-error";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchLists = async () => {
  let response: Response;

  try {
    response = await fetch(`/api/to-do-lists`);
  } catch {
    throw new Error("NoConnection");
  }

  if (!response.ok) throw new Error("Unknown");
  return response.json() as Promise<List[]>;
};

const useLists = () => {
  const queryClient = useQueryClient();
  const queryKey = ["to-do-lists"] as const;

  const { data: lists, error } = useQuery({
    queryKey,
    queryFn: fetchLists,
  });

  const createListMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch(`/api/to-do-lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Failed to create list.");
      return response.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(
        error.message === "NoConnection"
          ? "No connection."
          : "Something went wrong.",
      );
    },
  });

  const renameListMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await fetch(`/api/to-do-lists`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      });
      if (!response.ok) throw new Error("Failed to rename list.");
      return true;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/to-do-lists`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete list.");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const listError = error
    ? error.message === "NoConnection"
      ? ToDoListError.NoConnection
      : ToDoListError.Unknown
    : undefined;

  return {
    lists,
    listError,
    createList: createListMutation.mutateAsync,
    renameList: (id: string, name: string) =>
      renameListMutation.mutateAsync({ id, name }),
    deleteList: deleteListMutation.mutateAsync,
    isLoading: !lists && !error,
  };
};

export default useLists;

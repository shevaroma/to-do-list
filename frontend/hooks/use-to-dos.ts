import type { ToDoBase } from "@/lib/to-do";
import ToDo from "@/lib/to-do";
import ToDoListError from "@/lib/to-do-list-error";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const buildToDosUrl = (listID?: string) =>
  `/api/to-dos${listID !== undefined ? `?todo_list_id=${listID}` : ""}`;

const fetchToDos = async (listID?: string) => {
  let response: Response;

  try {
    response = await fetch(buildToDosUrl(listID));
  } catch {
    throw new Error("NoConnection");
  }

  if (!response.ok) throw new Error("Unknown");
  return response.json() as Promise<ToDo[]>;
};

const useToDos = (listID?: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["to-dos", listID] as const;

  const {
    data: toDos,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: () => fetchToDos(listID),
  });

  const createToDoMutation = useMutation({
    mutationFn: async (toDo: ToDoBase) => {
      const response = await fetch(`/api/to-dos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toDo),
      });
      if (!response.ok) throw new Error("Failed to create to-do.");
      return response.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["to-dos"] });
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const updateToDoMutation = useMutation({
    mutationFn: async (toDo: ToDo) => {
      const response = await fetch(`/api/to-dos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toDo),
      });
      if (!response.ok) throw new Error("Failed to update to-do.");
      return true;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["to-dos"] });
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const deleteToDoMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/to-dos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete to-do.");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["to-dos"] });
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const deleteCompletedToDosMutation = useMutation({
    mutationFn: async (todoListId?: string) => {
      const response = await fetch(`/api/to-dos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: true,
          todo_list_id: todoListId ?? null,
        }),
      });
      if (!response.ok) throw new Error("Failed to delete completed to-dos.");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["to-dos"] });
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const toDoError = error
    ? error.message === "NoConnection"
      ? ToDoListError.NoConnection
      : ToDoListError.Unknown
    : undefined;

  return {
    toDos,
    toDoError,
    isLoading,
    isFetching,
    createToDo: createToDoMutation.mutateAsync,
    updateToDo: updateToDoMutation.mutateAsync,
    deleteToDo: deleteToDoMutation.mutateAsync,
    deleteCompletedToDos: deleteCompletedToDosMutation.mutateAsync,
    isCreating: createToDoMutation.isPending,
    isUpdating: updateToDoMutation.isPending,
    isDeleting: deleteToDoMutation.isPending,
    isDeletingCompleted: deleteCompletedToDosMutation.isPending,
  };
};

export default useToDos;

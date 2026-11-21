import type { ToDoBase } from "@/lib/to-do";
import ToDo from "@/lib/to-do";
import { apiFetch, toToDoListError } from "@/lib/api";
import { toastError } from "@/lib/toast-error";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const buildToDosUrl = (listID?: number) =>
  `/api/to-dos${listID !== undefined ? `?todo_list_id=${listID}` : ""}`;

const useToDos = (listID?: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["to-dos", listID] as const;

  const { data: toDos, error } = useQuery({
    queryKey,
    queryFn: () => apiFetch<ToDo[]>(buildToDosUrl(listID)),
  });

  const onSuccess = () =>
    void queryClient.invalidateQueries({ queryKey: ["to-dos"] });

  const createToDoMutation = useMutation({
    mutationFn: (toDo: ToDoBase) =>
      apiFetch<ToDo>("/api/to-dos", { method: "POST", json: toDo }),
    onSuccess,
    onError: toastError,
  });

  const updateToDoMutation = useMutation({
    mutationFn: (toDo: ToDo) =>
      apiFetch<ToDo>("/api/to-dos", { method: "PUT", json: toDo }),
    onSuccess,
    onError: toastError,
  });

  const deleteToDoMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch("/api/to-dos", { method: "DELETE", json: { id } }),
    onSuccess,
    onError: toastError,
  });

  const deleteCompletedToDosMutation = useMutation({
    mutationFn: (todoListId?: number) =>
      apiFetch("/api/to-dos", {
        method: "DELETE",
        json: { completed: true, todo_list_id: todoListId ?? null },
      }),
    onSuccess,
    onError: toastError,
  });

  return {
    toDos,
    toDoError: toToDoListError(error),
    createToDo: createToDoMutation.mutateAsync,
    updateToDo: updateToDoMutation.mutateAsync,
    deleteToDo: deleteToDoMutation.mutateAsync,
    deleteCompletedToDos: deleteCompletedToDosMutation.mutateAsync,
  };
};

export default useToDos;

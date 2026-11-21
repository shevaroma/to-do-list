import List from "@/lib/list";
import { apiFetch, toToDoListError } from "@/lib/api";
import { toastError } from "@/lib/toast-error";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const listsQueryKey = ["to-do-lists"] as const;

const useLists = () => {
  const queryClient = useQueryClient();

  const { data: lists, error } = useQuery({
    queryKey: listsQueryKey,
    queryFn: () => apiFetch<List[]>("/api/to-do-lists"),
  });

  const onSuccess = () =>
    void queryClient.invalidateQueries({ queryKey: listsQueryKey });

  const createListMutation = useMutation({
    mutationFn: (name: string) =>
      apiFetch<List>("/api/to-do-lists", { method: "POST", json: { name } }),
    onSuccess,
    onError: toastError,
  });

  const renameListMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      apiFetch<List>("/api/to-do-lists", {
        method: "PUT",
        json: { id, name },
      }),
    onSuccess,
    onError: toastError,
  });

  const deleteListMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch("/api/to-do-lists", { method: "DELETE", json: { id } }),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: [...listsQueryKey, id] });
      onSuccess();
    },
    onError: toastError,
  });

  return {
    lists,
    listError: toToDoListError(error),
    createList: createListMutation.mutateAsync,
    renameList: (id: number, name: string) =>
      renameListMutation.mutateAsync({ id, name }),
    deleteList: deleteListMutation.mutateAsync,
  };
};

export default useLists;

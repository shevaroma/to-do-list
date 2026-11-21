import List from "@/lib/list";
import { apiFetch, toToDoListError } from "@/lib/api";
import { listsQueryKey } from "@/hooks/use-lists";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useList = (listID?: number) => {
  const queryClient = useQueryClient();
  const { data: list, error } = useQuery({
    queryKey: [...listsQueryKey, listID],
    queryFn: () => apiFetch<List>(`/api/to-do-lists/${listID}`),
    enabled: listID !== undefined,
    initialData: () =>
      queryClient
        .getQueryData<List[]>(listsQueryKey)
        ?.find((list) => list.id === listID),
  });
  return { list, listError: toToDoListError(error) };
};

export default useList;

import User from "@/lib/user";
import { apiFetch, toToDoListError } from "@/lib/api";
import { toastError } from "@/lib/toast-error";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type UserUpdate = {
  display_name?: string;
  email?: string;
  password?: string;
  current_password?: string;
};

const updateMe = (payload: UserUpdate) =>
  apiFetch<{ user: User }>("/api/users/me", { method: "PUT", json: payload });

const useUser = () => {
  const queryClient = useQueryClient();
  const queryKey = ["user"] as const;

  const {
    data: user,
    error,
    isPending,
  } = useQuery({
    queryKey,
    queryFn: () => apiFetch<User>("/api/users/me"),
  });

  const onSuccess = () => void queryClient.invalidateQueries({ queryKey });

  const updateUserNameMutation = useMutation({
    mutationFn: (payload: { display_name: string }) => updateMe(payload),
    onSuccess: () => {
      onSuccess();
      toast.success("Display name updated successfully.");
    },
    onError: toastError,
  });

  const updateUserEmailMutation = useMutation({
    mutationFn: (payload: { email: string }) => updateMe(payload),
    onSuccess,
    onError: toastError,
  });

  // Errors are surfaced by the caller, which shows the backend's message.
  const updateUserPasswordMutation = useMutation({
    mutationFn: (payload: { password: string; current_password: string }) =>
      updateMe(payload),
    onSuccess,
  });

  const deleteUserMutation = useMutation({
    mutationFn: () => apiFetch("/api/users/me", { method: "DELETE" }),
    onError: toastError,
  });

  return {
    user,
    userError: toToDoListError(error),
    updateUserName: updateUserNameMutation.mutateAsync,
    updateUserEmail: updateUserEmailMutation.mutateAsync,
    updateUserPassword: updateUserPasswordMutation.mutateAsync,
    deleteUser: () => deleteUserMutation.mutateAsync(),
    isLoading: isPending,
  };
};

export default useUser;

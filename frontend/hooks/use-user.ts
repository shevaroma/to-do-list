import User from "@/lib/user";
import ToDoListError from "@/lib/to-do-list-error";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchUser = async () => {
  let response: Response;

  try {
    response = await fetch(`/api/users/me`);
  } catch {
    throw new Error("NoConnection");
  }

  if (!response.ok) throw new Error("Unknown");
  return response.json() as Promise<User>;
};

const useUser = () => {
  const queryClient = useQueryClient();
  const queryKey = ["user"] as const;

  const { data: user, error } = useQuery({
    queryKey,
    queryFn: fetchUser,
  });

  const updateUserNameMutation = useMutation({
    mutationFn: async (payload: { display_name: string }) => {
      const response = await fetch(`/api/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update user name.");
      return response.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      toast.success("Display name updated successfully.");
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const updateUserEmailMutation = useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await fetch(`/api/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update user email.");
      return response.json();
    },
    onSuccess: (data: { access_token?: string }) => {
      if (data?.access_token) {
        document.cookie = `access_token=${data.access_token}; path=/;`;
      }
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const updateUserPasswordMutation = useMutation({
    mutationFn: async (payload: {
      password: string;
      current_password: string;
    }) => {
      const response = await fetch(`/api/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = data?.message ?? "Something went wrong.";
        throw new Error(message);
      }
      return true;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/users/me`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete user.");
      return true;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const userError = error
    ? error.message === "NoConnection"
      ? ToDoListError.NoConnection
      : ToDoListError.Unknown
    : undefined;

  return {
    user,
    userError,
    updateUserName: updateUserNameMutation.mutateAsync,
    updateUserEmail: updateUserEmailMutation.mutateAsync,
    updateUserPassword: updateUserPasswordMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    isLoading: !user && !error,
  };
};
export default useUser;

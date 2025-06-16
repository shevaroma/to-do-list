import { useEffect, useState } from "react";
import User from "@/lib/user";
import ToDoListError from "@/lib/to-do-list-error";
import { toast } from "sonner";

const useUser = () => {
  const [user, setUser] = useState<User>();
  const [userError, setUserError] = useState<ToDoListError>();
  const getUser = async () => {
    try {
      const response = await fetch(`/api/users/me`);
      if (!response.ok) {
        setUser(undefined);
        setUserError(ToDoListError.Unknown);
        return;
      }
      setUser(await response.json());
      setUserError(undefined);
    } catch {
      setUser(undefined);
      setUserError(ToDoListError.NoConnection);
    }
  };
  const updateUserName = async (user: { display_name: string }) => {
    try {
      const response = await fetch(`/api/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        toast.error("Something went wrong.");
        return;
      }
      await getUser();
      toast.success("Display name updated successfully.");
    } catch {
      toast.error("No connection.");
    }
  };
  const updateUserEmail = async (user: { email: string }) => {
    try {
      const response = await fetch(`/api/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        toast.error("Something went wrong.");
        return;
      }
      const data = await response.json();
      if (data.access_token) {
        document.cookie = `access_token=${data.access_token}; path=/;`;
      }
      await getUser();
    } catch {
      toast.error("No connection.");
    }
  };
  const updateUserPassword = async (user: {
    password: string;
    current_password: string;
  }) => {
    const response = await fetch(`/api/users/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const message = data?.message;
      throw new Error(message);
    }
    await getUser();
    return true;
  };
  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/me`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        toast.error("Something went wrong.");
        return;
      }
      await getUser();
    } catch {
      toast.error("No connection.");
    }
  };
  useEffect(() => {
    void getUser();
  }, []);
  return {
    user,
    userError,
    updateUserName,
    updateUserEmail,
    updateUserPassword,
    deleteUser,
  };
};
export default useUser;

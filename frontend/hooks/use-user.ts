import { useEffect, useState } from "react";
import User from "@/lib/user";
import ToDoListError from "@/lib/to-do-list-error";

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
  useEffect(() => {
    void getUser();
  }, []);
  return { user, userError };
};

export default useUser;

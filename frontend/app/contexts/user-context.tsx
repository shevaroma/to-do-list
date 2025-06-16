"use client";

import { createContext, ReactNode, useContext } from "react";
import User from "@/lib/user";
import ToDoListError from "@/lib/to-do-list-error";
import useUser from "@/hooks/use-user";

type UserContextType = {
  user: User | undefined;
  userError: ToDoListError | undefined;
  getUser: () => Promise<void>;
  updateUserName: (user: { display_name: string }) => Promise<void>;
  updateUserEmail: (user: { email: string }) => Promise<void>;
  updateUserPassword: (user: {
    password: string;
    current_password: string;
  }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const userHook = useUser();

  return (
    <UserContext.Provider value={userHook}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const useUserContextSafe = () => {
  return useContext(UserContext);
};

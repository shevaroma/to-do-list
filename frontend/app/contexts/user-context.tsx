"use client";

import { createContext, ReactNode, useContext } from "react";
import useUser from "@/hooks/use-user";

type UserContextType = ReturnType<typeof useUser>;

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

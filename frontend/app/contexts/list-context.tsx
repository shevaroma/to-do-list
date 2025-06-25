"use client";

import { createContext, ReactNode, useContext } from "react";
import useLists from "@/hooks/use-lists";

type ListContextType = ReturnType<typeof useLists>;

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider = ({ children }: { children: ReactNode }) => {
  const listHook = useLists();

  return (
    <ListContext.Provider value={listHook}>{children}</ListContext.Provider>
  );
};

export const useListContext = () => {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const useListContextSafe = () => {
  return useContext(ListContext);
};

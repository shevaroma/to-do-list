import { toast } from "sonner";
import { useEffect, useState } from "react";
import List from "@/lib/list";
import ToDoListError from "@/lib/to-do-list-error";

const useLists = () => {
  const [lists, setLists] = useState<List[]>();
  const [listError, setListError] = useState<ToDoListError>();
  const getLists = async () => {
    try {
      const response = await fetch(`/api/to-do-lists`);
      if (!response.ok) {
        setLists(undefined);
        setListError(ToDoListError.Unknown);
        return;
      }
      setLists(await response.json());
      setListError(undefined);
    } catch {
      setLists(undefined);
      setListError(ToDoListError.NoConnection);
    }
  };
  const createList = async (name: string) => {
    try {
      const response = await fetch(`/api/to-do-lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        toast.error("Something went wrong.");
        return;
      }
      void getLists();
    } catch {
      toast.error("No connection.");
    }
  };
  const renameList = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/to-do-lists`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      });
      if (!response.ok) {
        toast.error("Something went wrong.");
        return;
      }
      void getLists();
    } catch {
      toast.error("No connection.");
    }
  };
  const deleteList = async (id: string) => {
    try {
      const response = await fetch(`/api/to-do-lists`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        toast.error("Something went wrong.");
        return;
      }
      void getLists();
    } catch {
      toast.error("No connection.");
    }
  };
  useEffect(() => {
    void getLists();
  }, []);
  return { lists, listError, createList, renameList, deleteList };
};

export default useLists;

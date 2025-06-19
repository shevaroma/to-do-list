import { useCallback, useEffect, useState } from "react";
import ToDo from "@/lib/to-do";
import { toast } from "sonner";
import ToDoListError from "@/lib/to-do-list-error";

const useToDos = (listID?: string) => {
  const [toDos, setToDos] = useState<ToDo[]>();
  const [toDoError, setToDoError] = useState<ToDoListError>();
  const getToDos = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/to-dos${listID !== undefined ? `?todo_list_id=${listID}` : ""}`,
      );
      if (!response.ok) {
        setToDos(undefined);
        setToDoError(ToDoListError.Unknown);
        return;
      }
      setToDos(await response.json());
      setToDoError(undefined);
    } catch {
      setToDos(undefined);
      setToDoError(ToDoListError.NoConnection);
    }
  }, [listID]);
  const createToDo = async (toDo: ToDo) => {
    try {
      const response = await fetch(`/api/to-dos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toDo),
      });
      if (!response.ok) {
        toast.error("Something went wrong.");
        return;
      }
      await getToDos();
    } catch {
      toast.error("No connection.");
    }
  };
  const updateToDo = async (toDo: ToDo) => {
    try {
      const response = await fetch(`/api/to-dos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toDo),
      });
      if (!response.ok) {
        toast.error("Something went wrong.");
        return;
      }
      await getToDos();
    } catch {
      toast.error("No connection.");
    }
  };
  const deleteToDo = async (id: number) => {
    try {
      const response = await fetch(`/api/to-dos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        toast.error("Something went wrong.");
        return;
      }
      await getToDos();
    } catch {
      toast.error("No connection.");
    }
  };
  useEffect(() => {
    void getToDos();
  }, [getToDos]);
  return { toDos, toDoError, createToDo, updateToDo, deleteToDo };
};

export default useToDos;

"use client";

import { useEffect, useState } from "react";
import Header from "@/app/(main)/header";
import useToDos from "@/hooks/use-to-dos";
import ToDoListError from "@/lib/to-do-list-error";
import TodoButton from "@/app/(main)/todo-add-button";

const ListPageContent = ({ listID }: { listID?: string }) => {
  const [name, setName] = useState(listID === undefined ? "Inbox" : undefined);
  const [nameError, setNameError] = useState<ToDoListError>();
  const { toDoError } = useToDos(listID);
  useEffect(() => {
    if (listID === undefined) return;
    (async () => {
      try {
        const response = await fetch(`/api/to-do-lists/${listID}`);
        if (!response.ok) {
          setName(undefined);
          setNameError(ToDoListError.Unknown);
          return;
        }
        setName((await response.json()).title);
      } catch {
        setName(undefined);
        setNameError(ToDoListError.NoConnection);
      }
    })();
  }, [listID]);
  return (
    <div className="w-full flex flex-col">
      <Header title={name} />
      <TodoButton listID={listID} />
      {nameError === undefined && toDoError === undefined ? null : (
        <div className="text-muted-foreground text-center p-4 text-sm grow flex items-center justify-center">
          {nameError === ToDoListError.NoConnection &&
          toDoError === ToDoListError.NoConnection
            ? "No connection."
            : "Something went wrong."}
        </div>
      )}
    </div>
  );
};

export default ListPageContent;

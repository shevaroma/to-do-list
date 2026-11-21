"use client";

import { useEffect, useState } from "react";
import Header from "@/app/(main)/header";
import useToDos from "@/hooks/use-to-dos";
import ToDoListError from "@/lib/to-do-list-error";
import TodoButton from "@/app/(main)/todo-add-button";
import ToDoDialog from "@/app/(main)/to-do-dialog";
import ToDo from "@/lib/to-do";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useListContext } from "@/app/contexts/list-context";

const ListPageContent = ({ listID }: { listID?: number }) => {
  const [name, setName] = useState(listID === undefined ? "Inbox" : undefined);
  const [nameError, setNameError] = useState<ToDoListError>();
  const [editedToDo, setEditedToDo] = useState<ToDo>();
  const [addingToDo, setAddingToDo] = useState(false);
  const {
    toDos,
    toDoError,
    createToDo,
    updateToDo,
    deleteToDo,
    deleteCompletedToDos,
  } = useToDos(listID);
  const { lists } = useListContext();

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
    <>
      <div className="w-full flex flex-col">
        <Header title={name}>
          <Button
            onClick={() => {
              setAddingToDo(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </Header>
        <TodoButton
          onClick={(toDo) => setEditedToDo(toDo)}
          toDos={toDos}
          updateToDo={updateToDo}
          deleteToDo={deleteToDo}
          deleteCompletedToDos={() => deleteCompletedToDos(listID)}
        />
        {nameError === undefined && toDoError === undefined ? null : (
          <div className="text-muted-foreground text-center p-4 text-sm grow flex items-center justify-center">
            {nameError === ToDoListError.NoConnection &&
            toDoError === ToDoListError.NoConnection
              ? "No connection."
              : "Something went wrong."}
          </div>
        )}
      </div>
      <ToDoDialog
        open={editedToDo !== undefined || addingToDo}
        onCancel={() => {
          setEditedToDo(undefined);
          setAddingToDo(false);
        }}
        onSave={async (title, description, dueDate, priority, todoListId) => {
          try {
            if (addingToDo) {
              await createToDo({
                title,
                description,
                due_date: dueDate,
                priority,
                todo_list_id: todoListId,
              });
              setAddingToDo(false);
              return true;
            }
            if (editedToDo !== undefined) {
              await updateToDo({
                ...editedToDo,
                title,
                description: description || null,
                due_date: dueDate,
                priority: priority || null,
                todo_list_id: todoListId,
              });
              setEditedToDo(undefined);
              return true;
            }
          } catch {
            return false;
          }
          return false;
        }}
        title={editedToDo?.title || ""}
        description={editedToDo?.description || ""}
        dueDate={editedToDo?.due_date || null}
        priority={editedToDo?.priority || null}
        todoListId={editedToDo?.todo_list_id ?? listID ?? null}
        lists={lists || []}
      />
    </>
  );
};

export default ListPageContent;

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import useToDos from "@/hooks/use-to-dos";
import type ToDo from "@/lib/to-do";
import TodoContainer from "@/app/(main)/todo-container";

const TodoAddButton = ({ listID }: { listID?: string }) => {
  const { toDos, createToDo, updateToDo, deleteToDo } = useToDos(listID);
  const [editingInlineId, setEditingInlineId] = useState<string | null>(null);

  const handleCreateEmptyTodo = async () => {
    const newTodo: ToDo = {
      id: "",
      title: "",
      description: null,
      due_date: null,
      priority: null,
      todo_list_id: listID ?? null,
      is_completed: false,
      owner_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const created = await createToDo(newTodo);
    setEditingInlineId(created.id);
  };

  const sortedToDos = [...(toDos ?? [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const handleUpdateTodo = async (todo: ToDo) => {
    await updateToDo(todo);
    setEditingInlineId(null);
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteToDo(Number(id));
  };

  const handleToggleComplete = async (id: string) => {
    const todo = toDos?.find((t) => t.id === id);
    if (!todo) return;
    await updateToDo({ ...todo, is_completed: !todo.is_completed });

    if (!todo.is_completed) {
      setTimeout(async () => {
        await deleteToDo(Number(id));
      }, 1500);
    }
  };

  const handleStartEdit = (id: string) => setEditingInlineId(id);

  const handleCancelEdit = (id: string) => {
    const todo = toDos?.find((t) => t.id === id);
    if (
      todo &&
      !todo.title.trim() &&
      (!todo.description || !todo.description.trim())
    ) {
      handleDeleteTodo(id);
    }
    setEditingInlineId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-medium text-zinc-800 dark:text-zinc-100"></h1>
        <Button
          onClick={handleCreateEmptyTodo}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 p-0"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <TodoContainer
        todos={sortedToDos}
        onToggleComplete={handleToggleComplete}
        onDeleteTodo={handleDeleteTodo}
        editingInlineId={editingInlineId}
        onStartEdit={handleStartEdit}
        onSaveEdit={handleUpdateTodo}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  );
};

export default TodoAddButton;

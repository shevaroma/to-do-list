"use client";

import type ToDo from "@/lib/to-do";
import { AnimatePresence, motion } from "framer-motion";
import TodoItem from "@/app/(main)/todo-item";
import { Separator } from "@/components/ui/separator";

const TodoAddButton = ({
  onClick,
  toDos,
  updateToDo,
  deleteToDo,
}: {
  onClick: (toDo: ToDo) => void;
  toDos?: ToDo[];
  createToDo: (toDo: ToDo) => Promise<void>;
  updateToDo: (toDo: ToDo) => Promise<void>;
  deleteToDo: (id: number) => Promise<void>;
}) => {
  const handleDeleteTodo = async (id: string) => {
    await deleteToDo(Number(id));
  };

  const handleToggleComplete = async (id: string) => {
    const todo = toDos?.find((t) => t.id === id);
    if (!todo) return;
    await updateToDo({ ...todo, is_completed: !todo.is_completed });
  };

  if (toDos === undefined) return null;

  if (toDos?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
        <p className="text-sm">No todos yet</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ul className="space-y-2">
          <AnimatePresence>
            {toDos
              .filter((toDo) => !toDo.is_completed)
              .map((todo) => (
                <motion.li
                  key={todo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <TodoItem
                    todo={todo}
                    onToggleComplete={handleToggleComplete}
                    onDeleteTodo={handleDeleteTodo}
                    onStartEdit={() => {
                      onClick(todo);
                    }}
                  />
                </motion.li>
              ))}
          </AnimatePresence>
        </ul>
        {toDos.some((todo) => todo.is_completed) && (
          <>
            <div className="pt-8">
              <Separator className="my-4" />
            </div>
            <div className="flex justify-start text-zinc-400 my-2">
              <p className="text-base pl-2">Completed</p>
            </div>
          </>
        )}
        <ul>
          {toDos
            .filter((toDo) => toDo.is_completed)
            .map((todo) => (
              <motion.li
                key={todo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TodoItem
                  todo={todo}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTodo={handleDeleteTodo}
                  onStartEdit={() => {
                    onClick(todo);
                  }}
                />
              </motion.li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoAddButton;

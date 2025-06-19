"use client";

import { AnimatePresence, motion } from "framer-motion";
import TodoItem from "@/app/(main)/todo-item";
import type ToDo from "@/lib/to-do";

type TodoContainerProps = {
  todos: ToDo[];
  onToggleComplete: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  editingInlineId: string | null;
  onStartEdit: (id: string) => void;
  onSaveEdit: (todo: ToDo) => void;
  onCancelEdit: (id: string) => void;
};

const TodoContainer = ({
  todos,
  onToggleComplete,
  onDeleteTodo,
  editingInlineId,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}: TodoContainerProps) => {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
        <p className="text-sm">No todos yet</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ul className="space-y-2">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.li
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TodoItem
                todo={todo}
                onToggleComplete={onToggleComplete}
                onDeleteTodo={onDeleteTodo}
                isEditingInline={editingInlineId === todo.id}
                onStartEdit={onStartEdit}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default TodoContainer;

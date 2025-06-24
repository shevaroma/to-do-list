"use client";

import { useState } from "react";
import { Ellipsis, Trash2 } from "lucide-react";
import ToDo from "@/lib/to-do";
import { priorityColors } from "@/lib/priority";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TodoItemProps = {
  todo: ToDo;
  onToggleComplete: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  isEditingInline?: boolean;
  onStartEdit: (id: string) => void;
  onSaveEdit?: (todo: ToDo) => void;
  onCancelEdit?: (id: string) => void;
};

const TodoItem = ({
  todo,
  onToggleComplete,
  onDeleteTodo,
  onStartEdit,
}: TodoItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDaysLeft = (deadline: string | null) => {
    if (!deadline) return null;

    const end = new Date(deadline);
    const now = new Date();
    end.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysLeft: number | null = getDaysLeft(todo.due_date);

  return (
    <div
      className={`flex items-center p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-sm transition-all cursor-pointer ${
        todo.is_completed ? "opacity-60" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onStartEdit(todo.id)}
    >
      <div className="flex items-center flex-1">
        <Checkbox
          checked={todo.is_completed || false}
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={() => onToggleComplete(todo.id)}
          className="mr-3 rounded-full border-2 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            {todo.priority && (
              <div
                className={`w-2 h-2 rounded-full ${priorityColors[todo.priority ?? 0]}`}
              />
            )}
            <h3
              className={`font-medium ${todo.is_completed ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-800 dark:text-zinc-200"}`}
            >
              {todo.title}
            </h3>
          </div>
          {todo.description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
              {todo.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {todo.due_date &&
          !todo.is_completed &&
          (daysLeft !== null ? (
            daysLeft < 0 ? (
              <span className="text-xs text-red-500 font-medium">Overdue</span>
            ) : (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
              </span>
            )
          ) : null)}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700">
                <Ellipsis className="h-4 w-4 text-zinc-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onDeleteTodo(todo.id)}
                className="text-red-500 focus:text-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </div>
  );
};

export default TodoItem;

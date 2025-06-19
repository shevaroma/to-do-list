"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar, Check, Flag, X } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import ToDo from "@/lib/to-do";
import { getPriorityColor, getPriorityLabel } from "@/lib/priority";

type TodoItemEditProps = {
  todo: ToDo;
  onSave: (todo: ToDo) => void;
  onCancel: (id: string) => void;
};

const TodoItemEdit = ({ todo, onSave, onCancel }: TodoItemEditProps) => {
  const [editedTodo, setEditedTodo] = useState<ToDo>(todo);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const handleSave = () => {
    if (editedTodo.title.trim()) {
      onSave({
        ...editedTodo,
        updated_at: new Date().toISOString(),
      });
    } else {
      onCancel(todo.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleCancel = () => {
    if (!editedTodo.title.trim()) {
      onCancel(todo.id);
    } else {
      onCancel(todo.id);
    }
  };

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border-2 border-blue-200 dark:border-blue-800">
      <div className="space-y-3">
        <Input
          ref={titleInputRef}
          value={editedTodo.title}
          onChange={(e) =>
            setEditedTodo({ ...editedTodo, title: e.target.value })
          }
          placeholder="What needs to be done?"
          className="w-full bg-transparent text-base font-medium border-none p-0 h-auto focus:outline-none focus:ring-0 focus-visible:ring-0 placeholder:text-muted-foreground"
          onKeyDown={handleKeyDown}
        />
        <Textarea
          value={editedTodo.description || ""}
          onChange={(e) =>
            setEditedTodo({
              ...editedTodo,
              description: e.target.value || null,
            })
          }
          placeholder="Add some details... (optional)"
          className="w-full bg-transparent resize-none text-sm border-none p-0 min-h-[60px] focus:outline-none focus:ring-0 focus-visible:ring-0 placeholder:text-muted-foreground"
          onKeyDown={handleKeyDown}
        />

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-2 ${editedTodo.due_date ? "text-blue-600" : "text-gray-400"}`}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  {editedTodo.due_date
                    ? format(new Date(editedTodo.due_date), "MMM d")
                    : "Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={
                    editedTodo.due_date
                      ? new Date(editedTodo.due_date)
                      : undefined
                  }
                  onSelect={(date) => {
                    setEditedTodo({
                      ...editedTodo,
                      due_date: date?.toISOString() || null,
                    });
                    setIsCalendarOpen(false);
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            <Select
              value={editedTodo.priority?.toString() || "0"}
              onValueChange={(value) =>
                setEditedTodo({
                  ...editedTodo,
                  priority: value === "0" ? null : Number.parseInt(value),
                })
              }
            >
              <SelectTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-2 ${getPriorityColor(editedTodo.priority)}`}
                >
                  <Flag className="h-4 w-4 mr-1" />
                  {getPriorityLabel(editedTodo.priority)}
                </Button>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                <SelectItem value="3">Low</SelectItem>
                <SelectItem value="2">Medium</SelectItem>
                <SelectItem value="1">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItemEdit;

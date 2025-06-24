import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Flag, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { getPriorityColor, getPriorityLabel } from "@/lib/priority";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import List from "@/lib/list";

const ToDoDialog = ({
  open,
  title,
  description,
  dueDate,
  priority,
  onSave,
  onCancel,
  lists,
  todoListId,
}: {
  open: boolean;
  title: string;
  description?: string;
  dueDate: string | null;
  priority: number | null;
  todoListId: string | null;
  onSave: (
    title: string,
    description: string | null,
    dueDate: string | null,
    priority: number | null,
    todoListId: string | null,
  ) => void;
  onCancel: () => void;
  lists: List[];
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description || "");
  const [newDueDate, setNewDueDate] = useState(dueDate);
  const [newPriority, setNewPriority] = useState(priority);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [newListId, setNewListId] = useState(todoListId);

  useEffect(() => {
    setNewTitle(title);
    setNewDescription(description || "");
    setNewDueDate(dueDate);
    setNewPriority(priority);
    setNewListId(todoListId);
  }, [title, description, dueDate, priority, todoListId]);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const handleSave = () => {
    if (newTitle.trim()) {
      onSave(
        newTitle,
        newDescription || null,
        newDueDate,
        newPriority || null,
        newListId,
      );
      onCancel();
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
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title !== "" ? "Edit to-do" : "New to-do"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            ref={titleInputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-transparent text-base font-medium border-none p-0 h-auto focus:outline-none focus:ring-0 focus-visible:ring-0 placeholder:text-muted-foreground"
            onKeyDown={handleKeyDown}
          />
          <Textarea
            value={newDescription || ""}
            onChange={(e) => setNewDescription(e.target.value)}
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
                    className={`h-8 px-2 ${newDueDate ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    {newDueDate
                      ? format(new Date(newDueDate), "MMM d")
                      : "Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={newDueDate ? new Date(newDueDate) : undefined}
                    onSelect={(date) => {
                      setNewDueDate(date?.toISOString() || null);
                      setIsCalendarOpen(false);
                    }}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <Select
                value={newPriority?.toString() || "0"}
                onValueChange={(value) =>
                  setNewPriority(value === "0" ? null : Number.parseInt(value))
                }
              >
                <SelectTrigger
                  className={`h-8 px-2 ${getPriorityColor(newPriority)}`}
                >
                  <Flag className="h-4 w-4 mr-1" />
                  {getPriorityLabel(newPriority)}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Low</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="1">High</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newListId || ""}
                onValueChange={(value) => setNewListId(value || null)}
              >
                <SelectTrigger className="h-12 px-2 text-gray-900">
                  {lists.find((list) => list.id === newListId)?.title ||
                    "Select list"}
                </SelectTrigger>
                <SelectContent>
                  {lists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.title}
                    </SelectItem>
                  ))}
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
                className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:text-gray-400"
                disabled={!newTitle.trim() || newTitle.length === 0}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToDoDialog;

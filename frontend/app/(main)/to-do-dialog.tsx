import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Flag } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPriorityColor, getPriorityLabel } from "@/lib/priority";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import List from "@/lib/list";

const INBOX_LIST_VALUE = "inbox";

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
  ) => Promise<boolean>;
  onCancel: () => void;
  lists: List[];
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description || "");
  const [newDueDate, setNewDueDate] = useState(dueDate);
  const [newPriority, setNewPriority] = useState(priority);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [newListId, setNewListId] = useState(todoListId ?? INBOX_LIST_VALUE);

  useEffect(() => {
    setNewTitle(title);
    setNewDescription(description || "");
    setNewDueDate(dueDate);
    setNewPriority(priority);
    setNewListId(todoListId ?? INBOX_LIST_VALUE);
    setIsCalendarOpen(false);
    if (open && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [open, title, description, dueDate, priority, todoListId]);

  const handleSave = async () => {
    if (newTitle.trim()) {
      const saved = await onSave(
        newTitle,
        newDescription || null,
        newDueDate,
        newPriority || null,
        newListId === INBOX_LIST_VALUE ? null : newListId,
      );
      if (saved) {
        onCancel();
      }
    }
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
            className="h-auto w-full rounded-none border-none bg-transparent p-0 text-base font-medium text-foreground shadow-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:border-transparent focus-visible:ring-0"
          />
          <Textarea
            value={newDescription || ""}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Add some details... (optional)"
            className="min-h-[60px] w-full resize-none rounded-none border-none bg-transparent p-0 text-sm text-foreground shadow-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:border-transparent focus-visible:ring-0"
          />

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Popover
                open={isCalendarOpen}
                onOpenChange={setIsCalendarOpen}
                modal={true}
              >
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
                value={newListId}
                onValueChange={(value) => setNewListId(value)}
              >
                <SelectTrigger className="h-12 bg-background/70 px-2 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <>
                    <SelectItem value={INBOX_LIST_VALUE} key={INBOX_LIST_VALUE}>
                      Inbox
                    </SelectItem>
                    {lists.map((list) => (
                      <SelectItem key={list.id} value={list.id.toString()}>
                        {list.title}
                      </SelectItem>
                    ))}
                  </>
                </SelectContent>
              </Select>
            </div>
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
      </DialogContent>
    </Dialog>
  );
};

export default ToDoDialog;

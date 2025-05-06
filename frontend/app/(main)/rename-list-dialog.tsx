import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import List from "@/app/(main)/list";

const RenameListDialog = ({
  list,
  onClose,
  onSave,
}: {
  list?: List;
  onClose: () => void;
  onSave: (newName: string) => void;
}) => {
  const [newName, setNewName] = useState("");
  useEffect(() => {
    if (list !== undefined) setNewName(list.title);
  }, [list]);
  return (
    <Dialog
      open={list !== undefined}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename list</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(newName);
            onClose();
          }}
        >
          <Input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              disabled={newName.trim() === "" || newName === list?.title}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameListDialog;

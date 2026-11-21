import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import List from "@/lib/list";

const RenameListForm = ({
  list,
  onClose,
  onSave,
}: {
  list: List;
  onClose: () => void;
  onSave: (newName: string) => void;
}) => {
  const [newName, setNewName] = useState(list.title);
  return (
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
          disabled={newName.trim() === "" || newName === list.title}
        >
          Save
        </Button>
      </DialogFooter>
    </form>
  );
};

const RenameListDialog = ({
  list,
  onClose,
  onSave,
}: {
  list?: List;
  onClose: () => void;
  onSave: (newName: string) => void;
}) => (
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
      {list !== undefined && (
        <RenameListForm
          key={list.id}
          list={list}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </DialogContent>
  </Dialog>
);

export default RenameListDialog;

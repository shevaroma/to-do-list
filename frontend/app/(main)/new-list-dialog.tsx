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

const NewListForm = ({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string) => void;
}) => {
  const [name, setName] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCreate(name);
        onClose();
      }}
    >
      <Input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        pattern="^(?!\s*$).+"
        title="Can’t be empty."
        required
      />
      <DialogFooter className="mt-4">
        <Button type="submit">Create</Button>
      </DialogFooter>
    </form>
  );
};

const NewListDialog = ({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}) => (
  <Dialog
    open={open}
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>New list</DialogTitle>
      </DialogHeader>
      <NewListForm onClose={onClose} onCreate={onCreate} />
    </DialogContent>
  </Dialog>
);

export default NewListDialog;

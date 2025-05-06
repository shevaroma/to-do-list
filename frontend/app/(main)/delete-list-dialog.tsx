import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Dialog } from "@/components/ui/dialog";

const DeleteListDialog = ({
  open,
  onClose,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}) => (
  <Dialog
    open={open}
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete list</DialogTitle>
        <DialogDescription>
          Are you sure? All to-dos in this list will also be deleted.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteListDialog;

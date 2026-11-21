import { toast } from "sonner";
import { isUnauthorized } from "@/lib/api";

export const toastError = (error: Error) => {
  if (isUnauthorized(error)) return;
  toast.error(error.message || "Something went wrong.");
};

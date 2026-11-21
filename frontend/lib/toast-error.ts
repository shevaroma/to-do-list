import { toast } from "sonner";
import { isUnauthorized } from "@/lib/api";

/** Shows a mutation error, except 401s, which redirect to sign-in instead. */
export const toastError = (error: Error) => {
  if (isUnauthorized(error)) return;
  toast.error(error.message || "Something went wrong.");
};

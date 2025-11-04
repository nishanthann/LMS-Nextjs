import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteChapter } from "../action"; // <-- import your deleteChapter action
import { toast } from "sonner";

export function DeleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) {
  const [pending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(() => {
      const deletePromise = async () => {
        const { data: result, error } = await tryCatch(
          deleteChapter({ chapterId, courseId })
        );

        if (error) throw new Error("Failed to delete chapter");
        if (result.status === "error") throw new Error(result.message);

        return result.message;
      };

      toast.promise(deletePromise(), {
        loading: "Deleting chapter...",
        success: (message) => message || "Chapter deleted successfully",
        error: (err) => err.message || "Failed to delete chapter",
      });
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Deleting this chapter will also remove
            all its lessons.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={handleDelete}
              disabled={pending}
              variant="destructive"
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

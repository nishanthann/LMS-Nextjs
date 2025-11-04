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
import { deleteLesson } from "../action";
import { toast } from "sonner";
export function DeleteLesson({
  lessonId,
  courseId,
  chapterId,
}: {
  lessonId: string;
  courseId: string;
  chapterId: string;
}) {
  const [pending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(() => {
      const deletePromise = async () => {
        const { data: result, error } = await tryCatch(
          deleteLesson({ chapterId, courseId, lessonId })
        );

        if (error) throw new Error("Failed to delete lesson");

        if (result.status === "error") {
          throw new Error(result.message);
        }

        return result.message;
      };

      toast.promise(deletePromise(), {
        loading: "Deleting lesson...",
        success: (message) => message || "Lesson deleted successfully",
        error: (err) => err.message || "Failed to delete lesson",
      });
    });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"}>
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Lesson and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleDelete} disabled={pending}>
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

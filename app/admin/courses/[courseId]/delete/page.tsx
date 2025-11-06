"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTransition } from "react";
import { deleteCourse } from "./action";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Trash2, ArrowLeft } from "lucide-react";

export default function DeleteCourseRote() {
  const [pending, startTransition] = useTransition();
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));
      if (error) {
        toast.error("Failed to delete course");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <Card className="w-full max-w-lg  shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold text-destructive flex justify-center items-center gap-2">
            <Trash2 className="size-5" />
            Delete Course
          </CardTitle>
          <CardDescription>
            This action <strong>cannot be undone</strong>. Deleting this course
            will also remove all its chapters and lessons.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
          <Link href="/admin/courses" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 size-4" />
              Cancel
            </Button>
          </Link>

          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={onSubmit}
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 size-4" />
                Delete Course
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

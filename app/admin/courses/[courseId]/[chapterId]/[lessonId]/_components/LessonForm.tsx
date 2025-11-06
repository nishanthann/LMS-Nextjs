"use client";

import { adminGetLessonType } from "@/app/data/admin/admin-get-lesson";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

import { updateLesson } from "../action";
import RichTextEditor from "@/components/rich-text-editor";
import { MyDropzone } from "@/components/file-uploader/uploader";

interface iAppProps {
  data: adminGetLessonType;
  chapterId: string;
  courseId: string;
}

export function LessonForm({ data, chapterId, courseId }: iAppProps) {
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data?.title,
      description: data.description || "",
      chapterId,
      courseId,
      thumbnailKey: data.thumbnailKey || "",
      videoKey: data.videoKey || "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: LessonSchemaType) {
    const { data: result, error } = await tryCatch(
      updateLesson(data.id, values)
    );

    if (error) {
      toast.error("Failed to save lesson");
      return;
    }

    if (result.status === "success") {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }
  return (
    <div>
      <Link
        href={`/admin/courses/${courseId}/edit`}
        className={buttonVariants({ variant: "outline" })}
      >
        <ArrowLeft className="size-4 " />
        Go Back
      </Link>
      <Card className="w-full sm:max-w-5xl mx-auto mt-2">
        <CardHeader>
          <CardTitle>Lesson Configuration</CardTitle>
          <CardDescription>
            Fill in the lesson details below and click “Create”.
          </CardDescription>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Lesson Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Lesson Name
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        placeholder="e.g. Introduction to React"
                        {...field}
                      />
                      {fieldState.error && (
                        <p className="text-sm text-red-500 mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <RichTextEditor field={field} />
                      {fieldState.error && (
                        <p className="text-sm text-red-500 mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Thumbnail key */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Thumbnail Key
                </label>
                <Controller
                  name="thumbnailKey"
                  control={control}
                  render={({ field }) => (
                    <MyDropzone
                      onChange={field.onChange}
                      value={field.value}
                      fileTypeAccepted="image"
                    />
                  )}
                />
              </div>

              {/* Video key */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Video Key
                </label>
                <Controller
                  name="videoKey"
                  control={control}
                  render={({ field }) => (
                    <MyDropzone
                      onChange={field.onChange}
                      value={field.value}
                      fileTypeAccepted="video"
                    />
                  )}
                />
              </div>

              {/* Submit button */}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Lesson"
                )}
              </Button>
            </form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}

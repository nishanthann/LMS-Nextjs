"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { chapterSchema, ChapterSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { createChapter } from "../action";
import { toast } from "sonner";

export default function NewChapterModal({ courseId }: { courseId: string }) {
  console.log(courseId);
  const [pending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: "",
      courseId: courseId || "",
    },
  });
  function handleOpenModal(open: boolean) {
    setIsOpen(open);
  }
  function onSubmit(values: ChapterSchemaType) {
    console.log("Submitting values:", values);
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createChapter(values));
      if (error) {
        toast.error("Failed to create chapter");
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        setIsOpen(false);
        //   router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenModal}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"sm"} className="gap-2">
          <Plus className="size-4" />
          New Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>
            What would you like to name the chapter
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* <input type="hidden" {...form.register("courseId")} /> */}

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="chapter-name">Chapter Name</FieldLabel>
                <Input
                  {...field}
                  id="chapter-name"
                  placeholder="e.g. Introduction to JavaScript"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Chapter"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

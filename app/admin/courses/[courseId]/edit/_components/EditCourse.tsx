"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { tryCatch } from "@/hooks/try-catch";
import {
  courseCategories,
  courseLevels,
  courseSchema,
  CourseSchemaType,
  statuses,
} from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import slugify from "slugify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAdminSingleCourseType } from "@/app/data/admin/get-admin-singlecourse";
import { editCourseFile } from "../action";
import { MyDropzone } from "@/components/file-uploader/uploader";
import RichTextEditor from "@/components/rich-text-editor";

interface iAppProps {
  data: getAdminSingleCourseType;
}
export function EditCourseForm({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: data.title,
      description: data.description,
      fileKey: data.fileKey,
      price: data.price,
      duration: data.duration,
      level: data.level,
      category: data.category as CourseSchemaType["category"],
      smallDescription: data.smallDescription,
      slug: data.slug,
      status: data.status,
    },
  });
  function onSubmit(values: CourseSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        editCourseFile(values, data.id)
      );
      if (error) {
        toast.error("Failed to create course");
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <>
      <form id="form-course" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TITLE */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="course-title">Title</FieldLabel>
                <Input
                  {...field}
                  id="course-title"
                  placeholder="Enter course title"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* SLUG */}
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="course-slug">Slug</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    {...field}
                    id="course-slug"
                    placeholder="course-title-slug"
                    aria-invalid={fieldState.invalid}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const title = form.getValues("title") || "";
                      if (title) {
                        field.onChange(
                          slugify(title, { lower: true, strict: true })
                        );
                      }
                    }}
                  >
                    <Sparkle className="mr-1" />
                    Generate
                  </Button>
                </div>
                <FieldDescription>
                  Used in the course URL. Keep it unique.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* SHORT DESCRIPTION */}
          <Controller
            name="smallDescription"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="md:col-span-2"
              >
                <FieldLabel htmlFor="course-smallDescription">
                  Short Description
                </FieldLabel>
                <Input
                  {...field}
                  id="course-smallDescription"
                  placeholder="Brief summary of the course"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  Keep it concise — shown on course cards.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* DESCRIPTION */}
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="md:col-span-2"
              >
                <FieldLabel htmlFor="course-description">
                  Description
                </FieldLabel>
                <RichTextEditor field={field} />

                <FieldDescription>
                  Include what students will learn, prerequisites, etc.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* PRICE */}
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="course-price">Price (USD)</FieldLabel>
                <Input
                  {...field}
                  id="course-price"
                  type="number"
                  placeholder="Enter price"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* DURATION */}
          <Controller
            name="duration"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="course-duration">
                  Duration (hours)
                </FieldLabel>
                <Input
                  {...field}
                  id="course-duration"
                  type="number"
                  placeholder="Course length"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* LEVEL */}
          <Controller
            name="level"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="course-level">Level</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="course-level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseLevels.map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          {/* CATEGORY */}
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="course-category">Category</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="course-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Choose the category that best fits your course.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* STATUS */}
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="course-status">Status</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="course-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          {/* THUMBNAIL FILE */}
          <Controller
            name="fileKey"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="md:col-span-2"
              >
                <FieldLabel>Thumbnail</FieldLabel>

                <MyDropzone
                  onChange={field.onChange}
                  value={field.value}
                  fileTypeAccepted="image"
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                <FieldDescription>
                  Upload course thumbnail (image). Max size: 5MB.
                </FieldDescription>
              </Field>
            )}
          />
          <Field orientation="horizontal">
            <Button type="submit" disabled={pending} form="form-course">
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </Field>
        </div>
      </form>
    </>
  );
}

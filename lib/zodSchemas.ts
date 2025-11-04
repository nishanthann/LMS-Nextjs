import { z } from "zod";

export const courseLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export const statuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export const courseCategories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "UI/UX Design",
  "Cloud Computing",
  "Cyber Security",
  "Digital Marketing",
  "Blockchain",
  "DevOps",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(4, { message: "Title must be at least 4 characters long." })
    .max(100, { message: "Title cannot exceed 100 characters." }),

  description: z.string().min(4, {
    message: "Description is required and must be at least 4 characters.",
  }),

  fileKey: z
    .string()
    .min(1, { message: "Course material is required. Please upload a file." }),

  price: z
    .transform(Number)
    .pipe(z.number().min(1, { message: "Price must be at least 1." })),

  duration: z
    .transform(Number)
    .pipe(
      z
        .number()
        .min(1, { message: "Duration must be at least 1 hour." })
        .max(500, { message: "Duration cannot exceed 500 hours." })
    ),

  level: z.enum(courseLevels, {
    message:
      "Please select a valid course level (Beginner, Intermediate, or Advanced).",
  }),
  category: z.enum(courseCategories, {
    message: "Please select a valid course category from the list.",
  }),

  smallDescription: z
    .string()
    .min(4, { message: "Small description must be at least 4 characters." })
    .max(200, { message: "Small description cannot exceed 200 characters." }),

  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long." }),

  status: z.enum(statuses, {
    message:
      "Please select a valid course status (Draft, Published, or Archived).",
  }),
});

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Chapter name must be at least 3 characters long." })
    .max(100, { message: "Chapter name cannot exceed 100 characters." }),
  courseId: z.string().min(1, { message: "Course ID is required" }),
});
export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Chapter name must be at least 3 characters long." })
    .max(100, { message: "Chapter name cannot exceed 100 characters." }),
  courseId: z.string().min(1, { message: "Course ID is required" }),
  chapterId: z.string().min(1, { message: "Chapter ID is required" }),
  description: z
    .string()
    .min(4, {
      message: "Description is required and must be at least 4 characters.",
    })
    .optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;

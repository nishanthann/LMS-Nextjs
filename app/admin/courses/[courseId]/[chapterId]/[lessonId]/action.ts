"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";

export async function updateLesson(
  id: string,
  values: LessonSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    // Validate data
    const result = lessonSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid lesson data",
      };
    }

    const { name, description, videoKey, thumbnailKey, chapterId } =
      result.data;

    // Update the lesson
    await prisma.lessson.update({
      where: { id },
      data: {
        title: name,
        description,
        videoKey,
        thumbnailKey,
        chapterId,
      },
    });

    // Revalidate the course edit page
    // revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson updated successfully",
    };
  } catch (error) {
    console.error("Error updating lesson:", error);
    return {
      status: "error",
      message: "Failed to update lesson",
    };
  }
}

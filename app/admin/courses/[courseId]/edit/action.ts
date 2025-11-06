"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";

import arcjet, { fixedWindow } from "@/lib/arcjet";

import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
} from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(fixedWindow({ max: 2, window: "1m", mode: "LIVE" }));

export async function editCourseFile(
  values: CourseSchemaType,
  courseId: string
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requests. Please try again later.",
        };
      } else {
        return {
          status: "error",
          message: "Request blocked",
        };
      }
    }
    const validation = courseSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form data",
      };
    }
    await prisma.course.update({
      where: {
        id: courseId,
        userId: session.user.id,
      },
      data: {
        ...validation.data,
        userId: session?.user.id as string,
      },
    });
    return {
      status: "success",
      message: "Course updated succesfully",
    };
  } catch (error) {
    console.log((error as Error).message);
    return {
      status: "error",
      message: "Something went updating",
    };
  }
}

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons provided",
      };
    }
    const updates = lessons.map((lesson) =>
      prisma.lessson.update({
        where: {
          id: lesson.id,
        },
        data: {
          position: lesson.position,
        },
      })
    );
    await prisma.$transaction(updates);
    revalidatePath(`admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder lessons",
    };
  }
}
export async function reorderChapters(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No Chapters provided",
      };
    }
    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId: courseId,
        },
        data: {
          position: chapter.position,
        },
      })
    );
    await prisma.$transaction(updates);
    revalidatePath(`admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder Chapters",
    };
  }
}
export async function createChapter(
  values: ChapterSchemaType
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = chapterSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid  data",
      };
    }
    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.chapter.findFirst({
        where: {
          courseId: result.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });
      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: maxPos?.position ? maxPos.position + 1 : 1,
        },
      });
    });
    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);
    return {
      status: "success",
      message: "Chapter created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create New Chapter",
    };
  }
}

export async function createLesson(
  values: ChapterSchemaType
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = lessonSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid  data",
      };
    }
    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.lessson.findFirst({
        where: {
          chapterId: result.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });
      await tx.lessson.create({
        data: {
          title: result.data.name,
          chapterId: result.data.chapterId,
          description: result.data.description,
          videoKey: result.data.videoKey,
          thumbnailKey: result.data.thumbnailKey,
          position: maxPos?.position ? maxPos.position + 1 : 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create New Lesson",
    };
  }
}

export async function deleteLesson({
  lessonId,
  courseId,
  chapterId,
}: {
  lessonId: string;
  courseId: string;
  chapterId: string;
}): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      select: {
        lesson: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });
    if (!chapterWithLessons) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    const lessons = chapterWithLessons.lesson;

    const lessonsToDelete = lessons.find((lesson) => lesson.id === lessonId);

    if (!lessonsToDelete) {
      return {
        status: "error",
        message: "Lesson not found",
      };
    }

    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

    const updates = remainingLessons.map((lesson, index) =>
      prisma.lessson.update({
        where: {
          id: lesson.id,
        },
        data: {
          position: index + 1,
        },
      })
    );
    await prisma.$transaction([
      ...updates,
      prisma.lessson.delete({
        where: {
          id: lessonId,
          chapterId: chapterId,
        },
      }),
    ]);
    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete Lesson",
    };
  }
}

export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    // 1️⃣ Get all chapters for the course (ordered)
    const courseWithChapters = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        chapter: {
          orderBy: { position: "asc" },
          select: { id: true, position: true },
        },
      },
    });

    if (!courseWithChapters) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    const chapters = courseWithChapters.chapter;

    // 2️⃣ Ensure chapter exists
    const chapterToDelete = chapters.find((ch) => ch.id === chapterId);
    if (!chapterToDelete) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    // 3️⃣ Reorder remaining chapters
    const remainingChapters = chapters.filter((ch) => ch.id !== chapterId);
    const reorderUpdates = remainingChapters.map((ch, index) =>
      prisma.chapter.update({
        where: { id: ch.id },
        data: { position: index + 1 },
      })
    );

    // 4️⃣ Delete chapter + its lessons atomically
    await prisma.$transaction([
      prisma.lessson.deleteMany({ where: { chapterId } }),
      prisma.chapter.delete({ where: { id: chapterId } }),
      ...reorderUpdates,
    ]);

    // 5️⃣ Revalidate admin course edit page
    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return {
      status: "error",
      message: "Failed to delete Chapter",
    };
  }
}

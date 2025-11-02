import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getAdminSingleCourse(id: string) {
  await requireAdmin();

  const data = await prisma.course.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      category: true,
      description: true,
      fileKey: true,
      createdAt: true,
      duration: true,
      level: true,
      price: true,
      slug: true,
      smallDescription: true,
      status: true,
      updatedAt: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          createdAt: true,
          updatedAt: true,

          // Nested lessons inside chapter
          lesson: {
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              videoKey: true,
              thumbnailKey: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });
  if (!data) {
    return notFound();
  }
  return data;
}
export type getAdminSingleCourseType = Awaited<
  ReturnType<typeof getAdminSingleCourse>
>;

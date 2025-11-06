import "server-only";

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getIndivdualSingleCourse(slug: string) {
  const data = await prisma.course.findUnique({
    where: {
      slug: slug,
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
          lesson: {
            select: {
              id: true,
              title: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
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
  ReturnType<typeof getIndivdualSingleCourse>
>;

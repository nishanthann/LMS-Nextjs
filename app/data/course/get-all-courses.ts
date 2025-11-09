import "server-only";
import { prisma } from "@/lib/db";

export async function getAllCourses() {
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,

      slug: true,
      fileKey: true,
      smallDescription: true,
      status: true,
      level: true,
      price: true,
      duration: true,
      category: true,
    },
  });

  return data;
}

export type publicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];

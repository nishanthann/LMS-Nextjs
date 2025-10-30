import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function getAdminCourse() {
  await requireAdmin();
  const data = await prisma.course.findMany({
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
    },
  });

  return data;
}

export type getAdminCourseType = Awaited<ReturnType<typeof getAdminCourse>>[0];

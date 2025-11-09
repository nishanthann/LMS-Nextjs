import "server-only";

import { prisma } from "@/lib/db";

import { requireUser } from "./require-user";

export async function getEnrolledCourses() {
  const user = await requireUser();
  const data = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Active",
    },
    select: {
      Course: {
        select: {
          id: true,
          title: true,
          slug: true,
          fileKey: true,
          smallDescription: true,
          status: true,
          level: true,
          duration: true,
          category: true,
          price: true,

          chapter: {
            select: {
              id: true,
              lesson: {
                select: {
                  id: true,
                  lessonProgress: {
                    where: {
                      userId: user.id,
                    },
                    select: {
                      id: true,
                      completed: true,
                      lessonId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return data;
}
export type EnrolledtType = Awaited<ReturnType<typeof getEnrolledCourses>>[0];

import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetDashStats() {
  await requireAdmin();
  const [totalSignups, totalCustomers, totalCourses, totalLessons] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          enrollment: {
            some: {},
          },
        },
      }),
      prisma.course.count(),
      prisma.lessson.count(),
    ]);
  return {
    totalSignups,
    totalCustomers,
    totalCourses,
    totalLessons,
  };
}

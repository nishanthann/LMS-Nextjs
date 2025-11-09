import "server-only";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function checkCourseBought(courseId: string): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return false;
  }
  const enrollement = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        courseId: courseId,
        userId: session.user.id,
      },
    },
    select: {
      status: true,
    },
  });
  return enrollement?.status === "Active" ? true : false;
}

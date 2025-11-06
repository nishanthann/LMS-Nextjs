import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export async function adminGetLesson(id: string) {
  await requireAdmin();

  const data = await prisma.lessson.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      position: true,
      description: true,
      videoKey: true,
      thumbnailKey: true,
    },
  });
  if (!data) {
    return notFound();
  }
  return data;
}

export type adminGetLessonType = Awaited<ReturnType<typeof adminGetLesson>>;

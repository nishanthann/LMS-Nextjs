import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";

interface iAppProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: iAppProps) {
  const { slug } = await params;
  const course = await getCourseSidebarData(slug);
  const firstChapter = course.course.chapter[0];
  const firstLesson = firstChapter.lesson[0];

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-semibold">No lessons available</h1>
      <p className="text-muted-foreground mt-2">
        This course currently has no lessons to display.
      </p>
    </div>
  );
}

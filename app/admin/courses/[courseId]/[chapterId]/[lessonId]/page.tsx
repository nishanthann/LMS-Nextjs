import { adminGetLesson } from "@/app/data/admin/admin-get-lesson";
import { LessonForm } from "./_components/LessonForm";

type Params = Promise<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>;

export default async function LessonPage({ params }: { params: Params }) {
  const { chapterId, courseId, lessonId } = await params;
  const lesson = await adminGetLesson(lessonId);
  return (
    <div>
      <LessonForm data={lesson} chapterId={chapterId} courseId={courseId} />
    </div>
  );
}

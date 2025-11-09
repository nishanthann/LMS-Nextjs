import { useMemo } from "react";
import { CourseSideBarDataType } from "@/app/data/course/get-course-sidebar-data";

type CourseType = CourseSideBarDataType["course"];

export default function useCourseProgress(course: CourseType) {
  return useMemo(() => {
    if (!course?.chapter || course.chapter.length === 0) {
      return { completedCount: 0, totalLessons: 0, progressPercent: 0 };
    }

    const allLessons = course.chapter.flatMap((ch) => ch.lesson);
    const totalLessons = allLessons.length;
    const completedCount = allLessons.filter((l) =>
      l.lessonProgress.some((p) => p.completed)
    ).length;

    const progressPercent =
      totalLessons === 0
        ? 0
        : Math.round((completedCount / totalLessons) * 100);

    return { completedCount, totalLessons, progressPercent };
  }, [course]);
}

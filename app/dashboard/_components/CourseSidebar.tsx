"use client";
import { CourseSideBarDataType } from "@/app/data/course/get-course-sidebar-data";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ChevronDown, Play } from "lucide-react";
import LessonItems from "./LessonItems";
import { usePathname } from "next/navigation";
import useCourseProgress from "@/hooks/use-course-progress";

interface iAppProps {
  course: CourseSideBarDataType["course"];
}

export default function CourseSidebar({ course }: iAppProps) {
  const { completedCount, totalLessons, progressPercent } =
    useCourseProgress(course);
  const pathname = usePathname();
  const currentLessonId = pathname.split("/").pop();
  return (
    <div className="flex flex-col h-full">
      <div className="pb-4 pr-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Play className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className=" font-semibold text-base leading-tight truncate ">
              {course.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {course.category}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedCount}/{totalLessons} lessons
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {progressPercent}% completed
          </p>
        </div>
      </div>

      <div className="py-4 pr-4 space-y-2">
        {course.chapter.map((chapter, index) => (
          <Collapsible
            key={chapter.id}
            className="border rounded-lg overflow-hidden"
            defaultOpen={index === 0}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left  data-[state=open]:bg-primary/30 hover:bg-primary/40 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear ">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="font-medium">{chapter.title}</span>
                  <p className="text-sm text-muted-foreground">
                    {chapter.lesson.length} lessons
                  </p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 transition-transform duration-200 collapsible-trigger" />
            </CollapsibleTrigger>

            <CollapsibleContent className="px-4 py-3">
              <div className="space-y-2">
                {chapter.lesson.map((lesson) => (
                  <LessonItems
                    key={lesson.id}
                    lesson={lesson}
                    slug={course.slug}
                    isActive={currentLessonId === lesson.id}
                    completed={
                      lesson.lessonProgress.find(
                        (progress) => progress.lessonId === lesson.id
                      )?.completed || false
                    }
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}

"use client";
import { getLessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescribtion } from "@/components/rich-text-editor/RenderDescribtion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import { useConstruct } from "@/hooks/use-construct";
import { CheckCheckIcon, PlayCircle } from "lucide-react";
import { useTransition } from "react";
import { markLessonComplete } from "../action";
import { toast } from "sonner";

interface iAppProps {
  data: getLessonContentType;
}

export default function CourseContent({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();
  const videoUrl = useConstruct(data.videoKey as string);
  const thumbnailUrl = useConstruct(data.thumbnailKey as string);

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        markLessonComplete(data.id, data.chapter.course.slug)
      );
      if (error) {
        toast.error("Failed to mark course completion");
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div className="px-6 py-10 space-y-8">
      {/* Lesson Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <PlayCircle className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-semibold tracking-tight">
            {data.title}
          </h1>
        </div>
        <div>
          {data.lessonProgress.length > 0 ? (
            <Button
              variant={"outline"}
              className=" bg-green-500/30 text-green-600"
            >
              <CheckCheckIcon />
              completed
            </Button>
          ) : (
            <Button
              variant={"outline"}
              className=" hover:text-green-700 "
              onClick={onSubmit}
              disabled={pending}
            >
              <CheckCheckIcon />
              Mark as complete
            </Button>
          )}
        </div>
      </div>

      {/* Video Player */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border">
        {data.videoKey ? (
          <video
            src={videoUrl}
            controls
            poster={data.thumbnailKey ? thumbnailUrl : undefined}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-muted text-muted-foreground">
            <PlayCircle className="w-10 h-10 mb-2" />
            <p>No video available for this lesson</p>
          </div>
        )}
      </div>

      {/* Description Card */}
      <Card className="border rounded-lg">
        <CardHeader>
          <CardTitle>Lesson Description</CardTitle>
          <CardDescription className="text-muted-foreground">
            Learn key concepts covered in this lesson.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(data.description && (
            <RenderDescribtion json={JSON.parse(data.description)} />
          )) || <p>No description provided.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

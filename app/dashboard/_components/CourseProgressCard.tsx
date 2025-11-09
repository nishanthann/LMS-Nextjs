"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useConstruct } from "@/hooks/use-construct";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import useCourseProgress from "@/hooks/use-course-progress";

import { EnrolledtType } from "@/app/data/user/get-enrolled-courses";

interface iAppProps {
  data: EnrolledtType;
}

export default function CourseProgressCard({ data }: iAppProps) {
  const course = data.Course;
  const thumbnailUrl = useConstruct(course.fileKey);

  // Get progress
  const { completedCount, totalLessons, progressPercent } = useCourseProgress(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    course as any
  );

  return (
    <Card className="group relative overflow-hidden">
      {/* Level Badge */}
      <div className="absolute top-2 right-2 z-10">
        <Badge variant="secondary">{course.level}</Badge>
      </div>

      {/* Thumbnail */}
      <Image
        src={thumbnailUrl}
        alt={course.title}
        width={600}
        height={400}
        className="w-full h-48 -mt-6 object-cover rounded-t-lg block"
      />

      <CardContent className="p-4">
        {/* Title */}
        <Link
          href={`/courses/${course.slug}`}
          className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors"
        >
          {course.title}
        </Link>

        {/* Progress Section */}
        {totalLessons > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2 rounded-full" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedCount}/{totalLessons} lessons completed
            </p>
          </div>
        )}

        {/* Learn Button */}
        <Link
          href={`/dashboard/${course.slug}`}
          className={buttonVariants({ className: "w-full mt-4" })}
        >
          Learn <ArrowRight />
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="relative py-0 gap-0">
      <div className="w-full aspect-video">
        <Skeleton />
      </div>
      <CardContent className="p-4 space-y-4">
        <Skeleton className="h-5 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-10 w-full mt-4" />
      </CardContent>
    </Card>
  );
}

import { getAllCourses } from "@/app/data/course/get-all-courses";

import PublicCourseard, {
  PublicCourseCardSkeleton,
} from "./_components/PublicCourseard";
import { Suspense } from "react";
import { EmptyState } from "@/components/general/EmptyState";
import { Layers } from "lucide-react";
export const dynamic = "force-dynamic";

export default function PublicCoursePage() {
  return (
    <div className="min-h-screen bg-muted/10 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Explore Our Courses
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through our collection of expertly designed courses to
            enhance your skills and grow your career.
          </p>
        </div>

        {/* Mounting the separate course renderer */}
        <Suspense fallback={<PublicCourseCardSkeletonLayout />}>
          <RenderCourses />
        </Suspense>
      </div>
    </div>
  );
}

// ⬇️ Server component to fetch and render the courses
async function RenderCourses() {
  const courses = await getAllCourses();

  return (
    <>
      {courses.length === 0 ? (
        <EmptyState
          title="No courses available"
          description="We're working hard to bring you new learning experiences. Please check back soon!"
          icon={<Layers className="w-12 h-12 text-muted-foreground" />}
          actionLabel="Go Home"
          actionHref="/"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((course) => (
              <PublicCourseard data={course} key={course.id} />
            ))
          ) : (
            <p className="text-muted-foreground">No courses found.</p>
          )}
        </div>
      )}
    </>
  );
}

function PublicCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <PublicCourseCardSkeleton />
      <PublicCourseCardSkeleton />
      <PublicCourseCardSkeleton />
    </div>
  );
}

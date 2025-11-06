import { getAdminCourse } from "@/app/data/admin/get-admin-course";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from "./_components/AdminCourseCard";
import { EmptyState } from "@/components/general/EmptyState";
import { Layers } from "lucide-react";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold ">Your Courses</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          Create Course
        </Link>
      </div>
      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

async function RenderCourses() {
  const data = await getAdminCourse();

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No courses yet"
          description="Start building your course by adding the first course."
          actionLabel="Add Course"
          actionHref="/admin/courses/create"
          icon={<Layers className="w-12 h-12 text-muted-foreground" />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.length > 0 ? (
            data.map((course) => (
              <AdminCourseCard data={course} key={course.id} />
            ))
          ) : (
            <p className="text-muted-foreground">No courses found.</p>
          )}
        </div>
      )}
    </>
  );
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AdminCourseCardSkeleton />
      <AdminCourseCardSkeleton />
      <AdminCourseCardSkeleton />
      <AdminCourseCardSkeleton />
      <AdminCourseCardSkeleton />
    </div>
  );
}

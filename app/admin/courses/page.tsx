import { getAdminCourse } from "@/app/data/admin/get-admin-course";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

import { AdminCourseCard } from "./_components/AdminCourseCard";

export default async function Page() {
  const data = await getAdminCourse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold ">Your Courses</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          Create Course
        </Link>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length > 0 ? (
          data.map((course) => (
            <AdminCourseCard data={course} key={course.id} />
          ))
        ) : (
          <p className="text-muted-foreground">No courses found.</p>
        )}
      </div>
    </div>
  );
}

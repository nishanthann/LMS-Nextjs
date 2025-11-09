import { BookOpen, BookOpenCheck, PlayCircle } from "lucide-react";
import PublicCourseard from "../(public)/courses/_components/PublicCourseard";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";

import CourseProgressCard from "./_components/CourseProgressCard";

export default async function Page() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  return (
    <div className="px-6 py-8 space-y-12">
      {/* Enrolled Courses Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <PlayCircle className="w-6 h-6 text-primary" />
          Your Enrolled Courses
        </h2>

        {enrolledCourses.length === 0 ? (
          <div>
            <div className="mb-4">
              <BookOpenCheck className="size-10" />
            </div>
            <h2 className="text-lg font-semibold">
              {"You have enrolled in 0 courses."}
            </h2>

            <p className="text-sm text-muted-foreground mt-1 mb-4">
              {"Enrolled the course experience"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3  gap-6">
            {enrolledCourses.map((course) => (
              <CourseProgressCard key={course.Course.id} data={course} />
            ))}
          </div>
          // <div className="grid grid-cols-1 sm:grid-cols-2  gap-6">
          //   {enrolledCourses.map((course) => (
          //     <Link
          //       href={`/dashboard/${course.Course.slug}`}
          //       key={course.Course.id}
          //     >
          //       hi
          //     </Link>
          //   ))}
          // </div>
        )}
      </section>

      {/* All Courses Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Browse All Courses
        </h2>

        {courses.filter(
          (course) =>
            !enrolledCourses.some(
              ({ Course: enrolled }) => enrolled.id === course.id
            )
        ).length === 0 ? (
          <div>
            <div className="mb-4">
              <BookOpenCheck className="size-10" />
            </div>
            <h2 className="text-lg font-semibold">No courses availble</h2>

            <p className="text-sm text-muted-foreground mt-1 mb-4">
              {"You have enrolled in all courses."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
            {courses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    ({ Course: enrolled }) => enrolled.id === course.id
                  )
              )
              .map((course) => (
                <PublicCourseard key={course.id} data={course} />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function page() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold ">Your Courses</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          Create courses
        </Link>
      </div>
      <div>
        <h1>Here you will see all courses</h1>
      </div>
    </>
  );
}

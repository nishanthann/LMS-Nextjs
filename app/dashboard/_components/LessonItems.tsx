import { cn } from "@/lib/utils";
import { Check, Play } from "lucide-react";
import Link from "next/link";

interface iAppProps {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
  };
  slug: string;
  isActive?: boolean;
  completed: boolean;
}
export default function LessonItems({
  lesson,
  slug,
  isActive,
  completed,
}: iAppProps) {
  return (
    <Link
      href={`/dashboard/${slug}/${lesson.id}`}
      className={cn(
        "flex items-center gap-3 w-full rounded-md p-3 border transition-all duration-200",
        completed &&
          "border-green-600 bg-green-600/20 hover:bg-green-600 text-green-200",
        isActive &&
          "border-primary bg-primary/10 text-primary hover:bg-primary/20 font-semibold shadow-sm",
        !completed &&
          !isActive &&
          "border-border hover:bg-accent text-foreground"
      )}
    >
      {/* Lesson Icon */}
      <div
        className={cn(
          "size-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
          completed
            ? "border-green-500 bg-green-500"
            : isActive
              ? "border-primary bg-primary text-white"
              : "border-gray-300"
        )}
      >
        {completed ? (
          <Check className="size-3 text-white" />
        ) : (
          <Play
            className={cn(
              "size-3.5",
              isActive ? "text-white" : "text-gray-600"
            )}
          />
        )}
      </div>

      {/* Lesson Details */}
      <div className="flex flex-col min-w-0">
        <p
          className={cn(
            "text-sm truncate",
            completed && "text-green-700 font-medium"
          )}
        >
          {lesson.position}. {lesson.title}
        </p>

        {completed ? (
          <p className="text-xs text-green-600">Completed</p>
        ) : isActive ? (
          <p className="text-xs text-primary/70">Currently Viewing</p>
        ) : null}
      </div>
    </Link>
  );
}

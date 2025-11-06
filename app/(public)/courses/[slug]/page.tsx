import Image from "next/image";
import { getIndivdualSingleCourse } from "@/app/data/course/get-course";
import { RenderDescribtion } from "@/components/rich-text-editor/RenderDescribtion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Layers,
  GraduationCap,
  BookOpen,
  ChevronDown,
  PlayCircle,
  BadgeCheck,
  Infinity,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type Params = Promise<{ slug: string }>;

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getIndivdualSingleCourse(slug);
  const totalLessons = course.chapter.reduce(
    (acc, ch) => acc + ch.lesson.length,
    0
  );
  return (
    <div className="min-h-screen bg-muted/10 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ===== Left Side: Course Info ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Thumbnail */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image
              src={`https://nexuslms.t3.storage.dev/${course.fileKey}`}
              alt={course.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{course.category}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <GraduationCap className="w-3 h-3" /> {course.level}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {course.duration} hrs
            </Badge>
          </div>

          {/* Title & Small Description */}
          <div>
            <div className="flex items-center justify-between mt-6">
              <h2 className="text-xl font-semibold">Course Content</h2>
              <p className="text-sm text-muted-foreground">
                {course.chapter.length} Chapters •{" "}
                {course.chapter.reduce(
                  (total, chapter) => total + chapter.lesson.length,
                  0
                )}{" "}
                Lessons
              </p>
            </div>

            <p className="text-muted-foreground mt-2 text-sm">
              {course.smallDescription}
            </p>
          </div>

          {/* Rich Description */}
          <div className="prose max-w-none">
            <RenderDescribtion json={JSON.parse(course.description)} />
          </div>

          {/* Chapters & Lessons */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold mt-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Course Content
              </h2>
              <Badge variant="secondary" className="text-sm font-medium">
                {course.chapter.length} Chapters • {totalLessons} Lessons
              </Badge>
            </div>

            <div className="space-y-3">
              {course.chapter.map((chapter) => (
                <Collapsible
                  key={chapter.id}
                  className="border border-muted/50 rounded-lg shadow-sm bg-background"
                >
                  <CollapsibleTrigger className="w-full flex items-center justify-between p-4 text-left">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="font-medium">{chapter.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {chapter.lesson.length} lesson
                        {chapter.lesson.length !== 1 ? "s" : ""}
                      </Badge>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="px-6 pb-4 space-y-1">
                    {chapter.lesson.length > 0 ? (
                      chapter.lesson.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <PlayCircle className="w-4 h-4 text-primary/70" />
                          {lesson.title}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No lessons yet
                      </p>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Right Side: Sticky Purchase Card ===== */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="overflow-hidden shadow-lg border border-border/50">
              {/* Gradient Header with Price */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 text-center">
                <h2 className="text-4xl font-bold text-primary">
                  ${course.price}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Lifetime access
                </p>
              </div>

              <CardContent className="p-6 space-y-5">
                {/* CTA */}
                <Button size="lg" className="w-full text-base font-semibold">
                  Enroll Now
                </Button>

                {/* Divider */}
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    This course includes:
                  </p>

                  <div className="space-y-3 text-sm">
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{course.duration} hours on-demand video</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" />
                      <span>{course.chapter.length} chapters</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span>Level: {course.level}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-primary" />
                      <span>Certificate of completion</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Infinity className="w-4 h-4 text-primary" />
                      <span>Unlimited access, anytime</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

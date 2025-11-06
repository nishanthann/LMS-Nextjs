import { publicCourseType } from "@/app/data/course/get-all-courses";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, DollarSign, School, TimerIcon } from "lucide-react";
import { useConstruct } from "@/hooks/use-construct";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface iAppProps {
  data: publicCourseType;
}

export default function PublicCourseard({ data }: iAppProps) {
  const thumbnailUrl = useConstruct(data.fileKey);

  return (
    <Card className="group relative py-0 gap-0">
      {/* absolute dropdown */}
      <div className="absolute top-2 right-2 z-5 ">
        <Badge variant="secondary">{data.level}</Badge>
      </div>
      <Image
        src={thumbnailUrl}
        alt="thumbnail"
        width={600}
        height={400}
        className="w-full rounded-t-lg object-cover h-full aspect-video"
      />
      <CardContent className="p-4">
        <Link
          href={`/courses/${data.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-tight">
          {data.smallDescription}
        </p>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-1">
            <TimerIcon
              className="size-6 rounded-md text-primary
            bg-primary/10"
            />
            <p className="text-sm text-muted-foreground">{data.duration} hrs</p>
          </div>
          <div className="flex items-center gap-x-1">
            <School
              className="size-5 rounded-md text-primary
            bg-primary/10"
            />
            <p className="text-sm text-muted-foreground">
              {data.category.toLowerCase()}
            </p>
          </div>
          <div className="flex items-center gap-x-1">
            <DollarSign
              className="size-5 rounded-md text-primary
            bg-primary/10"
            />
            <p className="text-sm text-muted-foreground">{data.price}</p>
          </div>
        </div>
        <Link
          href={`/courses/${data.slug}`}
          className={buttonVariants({
            className: "w-full mt-4 ",
          })}
        >
          Learn More <ArrowRight />
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="relative py-0 gap-0">
      {/* Thumbnail skeleton */}
      <div className="w-full aspect-video">
        <Skeleton />
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Edit button */}
        <Skeleton className="h-10 w-full mt-4" />
      </CardContent>
    </Card>
  );
}

import { getAdminCourseType } from "@/app/data/admin/get-admin-course";
import { Card, CardContent } from "@/components/ui/card";
import { useConstruct } from "@/hooks/use-construct";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: getAdminCourseType;
}

export function AdminCourseCard({ data }: iAppProps) {
  const thumbnailUrl = useConstruct(data.fileKey);

  return (
    <Card className="group relative">
      {/* absolute dropdown */}
      <div></div>
      <Image
        src={thumbnailUrl}
        alt="thumbnail"
        width={600}
        height={400}
        className="w-full rounded-t-lg object-cover h-full aspect-video"
      />
      <CardContent>
        <Link
          href={`/admin/courses/${data.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-tight">
          {data.smallDescription}
        </p>
        <p>
          <strong>Level:</strong> {data.level}
        </p>
        <p>
          <strong>Duration:</strong> {data.duration} hrs
        </p>
        <p>
          <strong>Price:</strong> ${data.price}
        </p>
        <p>
          <strong>Status:</strong> {data.status}
        </p>
      </CardContent>
    </Card>
  );
}

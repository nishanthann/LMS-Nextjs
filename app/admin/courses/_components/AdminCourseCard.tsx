import { getAdminCourseType } from "@/app/data/admin/get-admin-course";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConstruct } from "@/hooks/use-construct";
import {
  ArrowRight,
  EllipsisVertical,
  Pencil,
  School,
  TimerIcon,
  Trash2,
  View,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: getAdminCourseType;
}

export function AdminCourseCard({ data }: iAppProps) {
  const thumbnailUrl = useConstruct(data.fileKey);

  return (
    <Card className="group relative py-0 gap-0">
      {/* absolute dropdown */}
      <div className="absolute top-2 right-2 z-5 ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="size-5 bg-primary/50" variant="secondary">
              <EllipsisVertical className="size-4 text-black" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-26" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/admin/courses/${data.id}/edit`}>
                  <Pencil className="size-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/courses/${data.slug}`}>
                  <View className="size-4 mr-2" />
                  Preview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/courses/${data.id}/delete`}>
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
          href={`/admin/courses/${data.id}/edit`}
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
              {data.level.toLowerCase()}
            </p>
          </div>
        </div>
        <Link
          href={`/admin/courses/${data.id}/edit`}
          className={buttonVariants({
            className: "w-full mt-4 ",
          })}
        >
          Edit Course <ArrowRight />
        </Link>
        {/* <p>
          <strong>Level:</strong> {data.level}
        </p>
       
        <p>
          <strong>Price:</strong> ${data.price}
        </p>
        <p>
          <strong>Status:</strong> {data.status}
        </p> */}
      </CardContent>
    </Card>
  );
}

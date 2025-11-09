import { IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminGetDashStats } from "@/app/data/admin/admin-get-dash-stats";

export async function SectionCards() {
  const stats = await adminGetDashStats();
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Signups */}
      <Card>
        <CardHeader>
          <CardDescription>Total Signups</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.totalSignups}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Users joined recently <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Total registered users</div>
        </CardFooter>
      </Card>

      {/* Total Customers */}
      <Card>
        <CardHeader>
          <CardDescription>Total Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.totalCustomers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +5.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Active paying users <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Those with enrollments</div>
        </CardFooter>
      </Card>

      {/* Total Courses */}
      <Card>
        <CardHeader>
          <CardDescription>Total Courses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.totalCourses}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +2.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Courses available <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Active published courses</div>
        </CardFooter>
      </Card>

      {/* Total Lessons */}
      <Card>
        <CardHeader>
          <CardDescription>Total Lessons</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.totalLessons}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Lessons created <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Across all courses</div>
        </CardFooter>
      </Card>
    </div>
  );
}

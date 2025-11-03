import { getAdminSingleCourse } from "@/app/data/admin/get-admin-singlecourse";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { EditCourseForm } from "./_components/EditCourse";
import CourseStructure from "./_components/CourseStructure";

type Params = Promise<{ courseId: string }>;
export default async function EditPage({ params }: { params: Params }) {
  const { courseId } = await params;
  const data = await getAdminSingleCourse(courseId);
  const serializableData = JSON.parse(JSON.stringify(data));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Edit Course:{""}{" "}
        <span className="text-primary underline">{data.title}</span>
      </h1>
      <Tabs defaultValue="basic-info" className="rounded-sm w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger
            className="data-[state=active]:!bg-primary/10  data-[state=active]:!text-primary data-[state=active]:shadow-none"
            value="basic-info"
          >
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:!bg-primary/10 data-[state=active]:!text-primary data-[state=active]:shadow-none"
            value="course-structure"
          >
            Course Structure
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info" className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>
                Provide basic information about the course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-structure" className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>Here you can edid the course</CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure data={serializableData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

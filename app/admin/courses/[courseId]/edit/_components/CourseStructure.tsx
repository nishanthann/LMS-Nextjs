"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ReactNode, useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { getAdminSingleCourseType } from "@/app/data/admin/get-admin-singlecourse";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronsDownIcon,
  ChevronsRightIcon,
  FileText,
  GripVertical,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { reorderChapters, reorderLessons } from "../action";

interface iAppProps {
  data: getAdminSingleCourseType;
}
interface sortableProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

export default function CourseStructure({ data }: iAppProps) {
  const intialItems =
    data.chapter.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,

      lessons: chapter.lesson.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];

  const [items, setItems] = useState(intialItems);
  useEffect(() => {
    setItems((prevItems) => {
      const updatedItems =
        data.chapter.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          order: chapter.position,
          isOpen:
            prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true,
          lessons: chapter.lesson.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
          })),
        })) || [];
      return updatedItems;
    });
  }, [data]);

  function SortableItem({ children, id, className, data }: sortableProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: id, data: data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging ? "z-10" : "")}
      >
        {children(listeners)}
      </div>
    );
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }
    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";
    const courseId = data.id;

    if (activeType === "chapter") {
      let targetChapterId = null;

      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }
      if (!targetChapterId) {
        toast.error("could not find target chapter");
        return;
      }
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);
      if (oldIndex === -1 || newIndex === -1) {
        toast.error("could not find target chapter for reordering");
        return;
      }

      const reorderLocalChapter = arrayMove(items, oldIndex, newIndex);
      const updatedChapterState = reorderLocalChapter.map((chapter, index) => ({
        ...chapter,
        order: index + 1,
      }));

      const previousItems = [...items];
      setItems(updatedChapterState);
      if (courseId) {
        const chapterToUpdate = updatedChapterState.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }));
        const reorderedChapterPromise = () =>
          reorderChapters(courseId, chapterToUpdate);
        toast.promise(reorderedChapterPromise(), {
          loading: "Reordering chapters...",
          success: (result) => {
            if (result.status === "success") return result.message;
            throw new Error(result.message);
          },
          error: () => {
            setItems(previousItems);
            return "Failed to reorder chapters";
          },
        });
      }
      return;
    }
    if (activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId ?? null;
      const overChapterId = over.data.current?.chapterId ?? null;

      if (!chapterId || !overChapterId) {
        toast.error("could not find target chapter for reordering");
        return;
      }
      const chapterIndex = items.findIndex((item) => item.id === chapterId);
      if (chapterIndex === -1) {
        toast.error("Could not find chapter for lesson");
      }
      const chapterToUpdate = items[chapterIndex];
      const oldLessonIndex = chapterToUpdate.lessons.findIndex(
        (item) => item.id === activeId
      );
      const newLessonIndex = chapterToUpdate.lessons.findIndex(
        (item) => item.id === overId
      );
      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error("Could not find target lesson for reordering");
        return;
      }
      const reorderedLessons = arrayMove(
        chapterToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      );
      const updatedLessonState = reorderedLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));
      const newItems = [...items];
      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: updatedLessonState,
      };
      const previousItems = [...items];
      setItems(newItems);
      if (courseId) {
        const lessonToUpdate = updatedLessonState.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }));
        const reorderedLessonsPromise = () =>
          reorderLessons(chapterId, lessonToUpdate, courseId);
        toast.promise(reorderedLessonsPromise(), {
          loading: "Reordering lessons...",
          success: (result) => {
            if (result.status === "success") return result.message;
            throw new Error(result.message);
          },
          error: () => {
            setItems(previousItems);
            return "Failed to reorder lessons";
          },
        });
      }
      return;
    }
  }
  function toggleChapter(chapterId: string) {
    setItems(
      items.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : { ...chapter }
      )
    );
  }

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);
  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row items-center  border-b border-border">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SortableContext strategy={verticalListSortingStrategy} items={items}>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: "chapter" }}
              >
                {(listeners) => (
                  <Card className="[border-radius:0!important]">
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapter(item.id)}
                      className="flex  flex-col gap-2"
                    >
                      <div className="flex items-center justify-between  p-3 border-b border-border">
                        <div className="flex items-center ">
                          <Button
                            variant={"ghost"}
                            {...listeners}
                            className="cursor-grab"
                          >
                            <GripVertical className="size-4" />
                          </Button>

                          <CollapsibleTrigger asChild>
                            <Button
                              variant={"ghost"}
                              className="flex items-center"
                            >
                              {item.isOpen ? (
                                <ChevronsDownIcon className="size-4" />
                              ) : (
                                <ChevronsRightIcon className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="cursor-pointer hover:text-primary">
                            {item.title}
                          </p>
                        </div>
                        <Button variant={"ghost"}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <CollapsibleContent className="flex flex-col gap-2">
                        <div className="p-1">
                          <SortableContext
                            strategy={verticalListSortingStrategy}
                            items={item.lessons.map((lesson) => lesson.id)}
                          >
                            {item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between  p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-1 ">
                                      <Button
                                        variant={"ghost"}
                                        {...lessonListeners}
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <Button variant={"ghost"}>
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2">
                            <Button variant={"outline"} className="w-full">
                              Create New Lesson
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}

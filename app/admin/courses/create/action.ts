"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";

import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arcjet
  .withRule(detectBot({ mode: "LIVE", allow: [] }))
  .withRule(fixedWindow({ max: 2, window: "1m", mode: "LIVE" }));

export async function createCourseFile(
  values: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requests. Please try again later.",
        };
      } else {
        return {
          status: "error",
          message: "Request blocked",
        };
      }
    }
    const validation = courseSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form daa",
      };
    }
    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string,
      },
    });
    return {
      status: "success",
      message: "Course created succesfully",
    };
  } catch (error) {
    console.log((error as Error).message);
    return {
      status: "error",
      message: "Something went wrong",
    };
  }
}

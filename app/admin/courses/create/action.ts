"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";

import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(fixedWindow({ max: 4, window: "1m", mode: "LIVE" }));

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
    const data = await stripe.products.create({
      name: validation.data.title,
      description: validation.data.description,
      default_price_data: {
        currency: "usd",
        unit_amount: validation.data.price * 100,
      },
    });
    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string,
        stripePriceId: data.default_price as string,
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

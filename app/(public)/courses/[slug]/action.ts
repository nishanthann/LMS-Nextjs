"use server";

import { requireUser } from "@/app/data/user/require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const aj = arcjet.withRule(fixedWindow({ max: 4, window: "1m", mode: "LIVE" }));

export async function enrollInCourseAction(
  courseId: string
): Promise<ApiResponse | never> {
  const user = await requireUser();
  let checkoutUrl: string;
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.id,
    });
    if (decision.isDenied()) {
      return {
        status: "error",
        message: "You are being bloked.",
      };
    }
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, price: true, slug: true },
    });
    if (!course) {
      return {
        status: "error",
        message: "Course not found.",
      };
    }
    let stripeCustomerId: string;

    const userWithStripe = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });
    if (userWithStripe?.stripeCustomerId) {
      stripeCustomerId = userWithStripe.stripeCustomerId;
    } else {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = newCustomer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: stripeCustomerId },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existenrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId,
          },
        },
        select: { status: true, id: true },
      });
      if (existenrollment?.status === "Active") {
        return {
          status: "success",
          message: "You are already enrolled in this course.",
        };
      }
      let newEnrollment;
      if (existenrollment) {
        newEnrollment = await tx.enrollment.update({
          where: {
            id: existenrollment.id,
          },
          data: {
            amount: course.price,
            status: "Pending",
            updatedAt: new Date(),
          },
        });
      } else {
        newEnrollment = await tx.enrollment.create({
          data: {
            userId: user.id,
            courseId: courseId,
            amount: course.price,
            status: "Pending",
          },
        });
      }
      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price: "price_1SQZ2IACoxsz0IJCyy653I8P",
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${process.env.BETTER_AUTH_URL}/payment/cancel`,
        metadata: {
          courseId: courseId,
          userId: user.id,
          enrollmentId: newEnrollment.id,
        },
      });
      return {
        enrollment: newEnrollment,
        checkoutUrl: checkoutSession.url!,
      };
    });
    checkoutUrl = result.checkoutUrl as string;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: "Payment error please try again later.",
      };
    } else {
      console.error("Enrollment Error:", error);
    }
    return {
      status: "error",
      message: "Failed to enroll in course.",
    };
  }
  redirect(checkoutUrl);
}

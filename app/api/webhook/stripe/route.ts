import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();

  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new Response("Webhook Error", { status: 404 });
  }

  const sesssion = event.data.object as Stripe.Checkout.Session;
  if (event.type === "checkout.session.completed") {
    const customerId = sesssion.customer as string;
    const courseId = sesssion.metadata?.courseId;
    if (!courseId) {
      throw new Error("No course id found");
    }
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
      select: { id: true },
    });
    if (!user) {
      throw new Error("No user found");
    }

    await prisma.enrollment.update({
      where: {
        id: sesssion.metadata?.enrollmentId as string,
      },
      data: {
        userId: user.id,
        courseId: courseId,
        amount: sesssion.amount_total as number,
        status: "Active",
      },
    });
  }
  return new Response("Webhook received", { status: 200 });
}

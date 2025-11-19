"use client";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import Link from "next/link";

interface featuresType {
  title: string;
  icon: string;
  description: string;
}
const features: featuresType[] = [
  {
    title: "Interactive Courses",
    icon: "📚",
    description:
      "Engage learners with video lessons, quizzes, and interactive assignments that make online learning more effective and fun.",
  },
  {
    title: "Progress Tracking",
    icon: "📈",
    description:
      "Track student progress, grades, and completion rates with detailed analytics dashboards for instructors and admins.",
  },
  {
    title: "Real-time Collaboration",
    icon: "💬",
    description:
      "Enable communication through discussion forums, live chat, and group projects to enhance peer-to-peer learning.",
  },
  {
    title: "Automated Certificates",
    icon: "🎓",
    description:
      "Automatically generate and award completion certificates to learners when they finish courses successfully.",
  },
];

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <>
      <section className="realative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline">The future of online Education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Welcome to Nextus!
          </h1>
          <p className="max-w-[700px]  text-muted-foreground md:text-xl">
            This is a simple example of a Next.js application using the new App
            Router feature. This is a simple example of a Next.js application
            using the new App Router feature.
          </p>
          {isPending ? null : session ? (
            <p className="max-w-[700px] text-xs md:text-xl text-red-600 animate-pulse">
              Your role hardcoded as Admin for now!
            </p>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link className={buttonVariants({ size: "lg" })} href="/courses">
              Explore Courses
            </Link>
            <Link
              className={buttonVariants({ variant: "outline", size: "lg" })}
              href="/login"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-center text-center p-6 border rounded-xl  hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}

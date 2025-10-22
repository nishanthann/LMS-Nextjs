import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/nlogowhite.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-svh items-center justify-center">
      <Link
        href={"/"}
        className={buttonVariants({
          variant: "ghost",
          className: "absolute top-4 left-4",
        })}
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href={"/"}
          className="flex items-center self-center gap-2 font-medium hover:opacity-80 transition-opacity"
        >
          <Image src={Logo} alt="logo" className="h-7 w-7" />
          NexusLearn
        </Link>
        {children}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

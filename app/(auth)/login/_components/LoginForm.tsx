"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import z from "zod";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [emailTransition, setEmailTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  async function signinGithub() {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logging in Github...");
          },
          onError: () => {
            toast.error("Something went wrong");
          },
        },
      });
    });
  }
  async function signinGmail() {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logging in Gmail...");
          },
          onError: () => {
            toast.error("Something went wrong");
          },
        },
      });
    });
  }

  function signin() {
    // Validate email before doing anything
    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      // Access the first issue
      setError(validation.error.issues[0].message);
      toast.error(validation.error.issues[0].message);
      return;
    }
    setError(null);
    setError(null);
    setEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email sent");

            router.push(`/verify-request?email=${email}`);
          },
          onError: () => {
            toast.error("Something went wrong");
          },
        },
      });
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>Please sign in to your account</CardDescription>
        <CardDescription>
          <p className="text-xs text-red-500 animate-pulse">
            Currently set dafault user role as Admin to view features
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <Button
          onClick={signin}
          className="w-full mt-5"
          disabled={emailTransition}
        >
          {emailTransition ? (
            <>
              {" "}
              <Loader className="size-4 animate-spin" />
            </>
          ) : (
            <>Continue with Email</>
          )}
        </Button>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className="relative text-center text-sm text-stone-500">
          <span className="relative px-2">Or continue with</span>
        </div>
        <Button
          disabled={isPending}
          variant="outline"
          className="w-full"
          onClick={signinGithub}
        >
          {isPending ? (
            <>
              {" "}
              <Loader className="size-4 animate-spin" />
            </>
          ) : (
            <div className="flex flex-row gap-2 items-center justify-center">
              <svg fill="none" viewBox="0 0 100 100">
                <path
                  fill="#161614"
                  d="M50 1C22.39 1 0 23.386 0 51c0 22.092 14.327 40.834 34.193 47.446 2.499.462 3.417-1.085 3.417-2.406 0-1.192-.047-5.131-.068-9.309-13.91 3.025-16.846-5.9-16.846-5.9-2.274-5.779-5.551-7.315-5.551-7.315-4.537-3.104.341-3.04.341-3.04 5.022.353 7.665 5.153 7.665 5.153 4.46 7.644 11.697 5.434 14.55 4.156.449-3.232 1.745-5.437 3.175-6.686-11.106-1.264-22.78-5.552-22.78-24.71 0-5.459 1.953-9.92 5.151-13.42-.519-1.26-2.23-6.346.485-13.233 0 0 4.198-1.344 13.753 5.125 3.988-1.108 8.266-1.663 12.515-1.682 4.25.019 8.53.574 12.526 1.682 9.544-6.469 13.736-5.125 13.736-5.125 2.722 6.887 1.01 11.973.49 13.232 3.206 3.502 5.146 7.962 5.146 13.42 0 19.205-11.697 23.434-22.83 24.671 1.793 1.552 3.391 4.595 3.391 9.26 0 6.69-.058 12.074-.058 13.721 0 1.33.9 2.89 3.435 2.399C85.692 91.819 100 73.085 100 51c0-27.614-22.386-50-50-50"
                />
                <path
                  fill="#161614"
                  d="M18.727 72.227c-.11.248-.502.322-.857.152-.363-.163-.567-.502-.45-.751.109-.256.5-.327.862-.156.363.163.57.505.445.755m2.46 2.194c-.24.221-.706.118-1.022-.231-.327-.349-.388-.814-.146-1.04.246-.22.698-.117 1.026.232.327.353.39.816.14 1.04zm1.687 2.808c-.307.213-.808.013-1.118-.432-.306-.444-.306-.977.007-1.191.31-.214.804-.021 1.118.42.305.452.305.985-.008 1.203m2.853 3.252c-.274.302-.858.22-1.285-.192-.437-.403-.56-.975-.284-1.277.277-.303.864-.218 1.295.191.434.403.566.979.274 1.278m3.688 1.098c-.12.391-.683.57-1.25.403-.565-.171-.935-.63-.821-1.026.118-.394.682-.58 1.253-.401.565.17.936.625.818 1.024m4.197.465c.014.413-.466.755-1.06.762-.599.013-1.082-.32-1.088-.726 0-.416.469-.755 1.067-.765.594-.012 1.081.32 1.081.73m4.123-.158c.071.403-.342.816-.932.926-.58.106-1.118-.143-1.192-.541-.072-.413.35-.826.928-.933.592-.103 1.12.14 1.196.548"
                />
              </svg>
              Continue with Github
            </div>
          )}
        </Button>
        <Button
          disabled={isPending}
          variant="outline"
          className="w-full"
          onClick={signinGmail}
        >
          {isPending ? (
            <>
              {" "}
              <Loader className="size-4 animate-spin" />
            </>
          ) : (
            <div className="flex flex-row gap-2 items-center justify-center">
              <svg fill="none" viewBox="0 0 100 100">
                <path
                  fill="#4285F4"
                  d="M95.833 51.021c0-3.77-.312-6.52-.983-9.375H50.933V58.66h25.775c-.516 4.225-3.32 10.592-9.558 14.87l-.088.567 13.884 10.542.958.092c8.842-7.992 13.93-19.759 13.93-33.709"
                />
                <path
                  fill="#34A853"
                  d="M50.938 95.833c12.625 0 23.225-4.076 30.97-11.105l-14.758-11.2c-3.95 2.7-9.25 4.584-16.212 4.584a28.1 28.1 0 0 1-26.609-19.05l-.55.046-14.437 10.95-.188.516c7.692 14.971 23.492 25.258 41.784 25.258"
                />
                <path
                  fill="#FBBC05"
                  d="M24.333 59.062a27.7 27.7 0 0 1-1.57-9.063c0-3.158.574-6.212 1.504-9.062l-.025-.613L9.625 29.2l-.48.225A45.1 45.1 0 0 0 4.168 50c0 7.384 1.816 14.363 4.987 20.575z"
                />
                <path
                  fill="#EB4335"
                  d="M50.938 21.888c8.783 0 14.704 3.716 18.083 6.824l13.196-12.629C74.113 8.7 63.563 4.167 50.937 4.167c-18.295 0-34.091 10.287-41.783 25.258L24.28 40.938a28.21 28.21 0 0 1 26.659-19.05"
                />
              </svg>
              Continue with Gmail
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

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
import { ModeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [emailTransition, setEmailTransition] = useTransition();
  async function signinGithub() {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged in successfully");
          },
          onError: () => {
            toast.error("Something went wrong");
          },
        },
      });
    });
  }
  function signin() {
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
          </div>
          {/* <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div> */}
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
          {/* <div className="absolute inset-0 flex items-center">
            <div className="border-border w-full border-t"></div>
          </div> */}
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
            <>Continue with Github</>
          )}
        </Button>
      </CardFooter>
      <ModeToggle />
    </Card>
  );
}

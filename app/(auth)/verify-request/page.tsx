"use client";

import { useState, useTransition } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isPending, startTransition] = useTransition();
  const params = useSearchParams();
  const email = params.get("email") as string;

  function signIn() {
    startTransition(async () => {
      // Call your backend OTP verification endpoint
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged in successfully");
            router.push("/");
          },
          onError: () => {
            toast.error("Something went wrong");
          },
        },
      });
    });
  }

  return (
    <div className="">
      <Card className="">
        <CardHeader className="text-center">
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            Enter the 6-digit code we sent to your email
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2 self-center">
              <Label className="block text-center" htmlFor="otp">
                One-Time Password (OTP)
              </Label>
              {/* <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                /> */}
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            onClick={signIn}
            className="w-full"
            disabled={isPending || otp.length < 6}
          >
            {isPending ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              <>Verify OTP</>
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full text-sm"
            disabled={isPending}
            onClick={() => console.log("Resend OTP")}
          >
            Resend Code
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

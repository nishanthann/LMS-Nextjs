import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="bg-background border rounded-2xl shadow-md max-w-md w-full p-8 text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-emerald-100 p-4 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
        </div>

        {/* Title & Message */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-emerald-600">
            Payment Successful
          </h1>
          <p className="text-muted-foreground mt-2">
            Your enrollment has been confirmed! You now have full access to your
            course materials.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>

          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>

        {/* Optional Extra Info */}
        <p className="text-sm text-muted-foreground">
          A confirmation email has been sent to your registered address.
        </p>
      </div>
    </div>
  );
}

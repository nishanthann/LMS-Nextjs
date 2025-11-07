import { Button } from "@/components/ui/button";
import { Home, XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="bg-background  rounded-2xl shadow-md max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-destructive/10 p-4 rounded-full">
            <XCircle className="w-12 h-12 text-destructive" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-destructive">
            Payment Failed
          </h1>
          <p className="text-muted-foreground mt-2">
            Your payment was not completed. You can try again or return to the
            dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              <Home /> Go Home
            </Link>
          </Button>

          {/* <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button> */}
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="max-w-md w-full border border-border shadow-md">
        <CardHeader className="flex flex-col items-center gap-2 text-center">
          <ShieldX className="w-16 h-16 text-destructive" />
          <CardTitle className="text-lg font-bold text-foreground">
            Access Denied
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            You do not have admin privileges to view this page.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center mt-4">
          {/* Optional: Add a button to go back or request access */}
          <Button variant="default" asChild>
            <Link href="/">
              <ArrowLeft className="my-auto" />
              <span className="text-base">Go Back</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

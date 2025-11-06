import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel = "",
  actionHref = "",
  icon = <PlusCircle className="w-10 h-10 text-muted-foreground" />,
}: EmptyStateProps) {
  return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <Card className="w-full max-w-md text-center border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-4">{icon}</div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              {description}
            </p>
          )}
          {actionHref && (
            <Link href={actionHref}>
              <Button className="mt-2">{actionLabel}</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

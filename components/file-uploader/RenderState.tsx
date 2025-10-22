import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon } from "lucide-react";

export function RenderState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-primary/30 mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-sm text-gray-500 mb-2">
        Drag & drop file here, or{" "}
        <span className="text-amber-500">click to upload</span>
      </p>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className="size-8 mx-auto " />
      </div>
      <p className="text-sm text-red-400 mb-2">Upload failed</p>
      <p className="text-sm text-red-400 mb-2">Something went wrong!</p>
      <p className="text-amber-500">click to upload again</p>
    </div>
  );
}

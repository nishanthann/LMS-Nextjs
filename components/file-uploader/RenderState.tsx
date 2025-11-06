import { cn } from "@/lib/utils";
import {
  CloudUploadIcon,
  ImageIcon,
  Loader,
  Loader2,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

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

export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleRemoval,
  fileType,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoval: () => void;
  fileType: "image" | "video";
}) {
  return (
    <div className="relative w-full h-60 rounded-md overflow-hidden">
      {fileType === "video" ? (
        <video src={previewUrl} controls className="rounded-md w-full h-full" />
      ) : (
        <Image
          src={previewUrl}
          alt="Uploade file"
          fill
          className="object-contain p-2"
        />
      )}
      <Button
        variant="destructive"
        size="icon"
        className={cn("absolute top-2 right-2")}
        onClick={handleRemoval}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <XIcon size={4} />
        )}
      </Button>
    </div>
  );
}

export function RenderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  const isImage = file.type.startsWith("image/");

  return (
    <div className="relative w-full h-64 flex flex-col items-center justify-center rounded-md  overflow-hidden">
      {isImage ? (
        <div className="relative w-full h-full">
          <Image
            src={URL.createObjectURL(file)}
            alt={file.name}
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full space-y-2">
          <Loader2 className="size-8 animate-spin text-amber-500" />
          <p className="text-sm text-gray-600">{file.name}</p>
        </div>
      )}

      {/* Overlay progress area */}
      <div className="absolute bottom-0 left-0 w-full bg-gray-200 h-2">
        <div
          className="h-2 bg-amber-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage label */}
      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
        {progress}%
      </div>
    </div>
  );
}

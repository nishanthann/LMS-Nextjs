"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Button } from "../ui/button";
import { RenderErrorState, RenderState } from "./RenderState";

import { toast } from "sonner";

export function MyDropzone() {
  const [hasError, setHasError] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Accepted files
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setHasError(false); // clear error
      toast.success(`File "${selectedFile.name}" uploaded successfully!`);
      console.log("Accepted file:", selectedFile);
    }
  }, []);

  // Rejected files
  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    setHasError(true);
    fileRejections.forEach((rejection) => {
      rejection.errors.forEach((error) => {
        switch (error.code) {
          case "file-too-large":
            toast.error("File is too large (max 5MB).");
            break;
          case "file-invalid-type":
            toast.error("Invalid file type.");
            break;
          case "too-many-files":
            toast.error("Only one file allowed.");
            break;
          default:
            toast.error("Upload failed.");
        }
      });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { "image/*": [], "application/pdf": [] },
    multiple: false,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-amber-500 "
            : hasError
              ? "border-red-500 "
              : "border-gray-300 hover:border-amber-500"
        }`}
    >
      <input {...getInputProps()} />

      {/* Show error state if hasError */}
      {hasError ? (
        <RenderErrorState />
      ) : file ? (
        <p className="text-sm font-medium text-gray-800">{file.name}</p>
      ) : (
        <RenderState isDragActive={isDragActive} />
      )}

      {!hasError && <RenderState isDragActive={isDragActive} />}
    </div>
  );
}

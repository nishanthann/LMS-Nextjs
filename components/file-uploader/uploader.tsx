"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";

import {
  RenderErrorState,
  RenderState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";

import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  error: boolean | null;

  isDeleting: boolean;
  objectUrl?: string | null;
  fileType: "image" | "video";
}

interface iAppProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function MyDropzone({ value, onChange }: iAppProps) {
  const [hasError, setHasError] = useState(false);
  const [file, setFile] = useState<UploaderState>({
    error: null,
    file: null,
    id: null,
    progress: 0,
    isDeleting: false,
    uploading: false,
    objectUrl: null,
    fileType: "image",
    key: value,
  });

  async function uploadFile(file: File) {
    setFile((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      // get presigned url
      const presignedResponse = await fetch("/api/s3/upload/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });
      if (!presignedResponse.ok) {
        toast.error("failed to get presigned URL");
        setFile((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
        return;
      }
      const { presignedUrl, key } = await presignedResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setFile((prev) => ({
              ...prev,
              progress,
            }));
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFile((prev) => ({
              ...prev,
              progress: 100,
              uploading: false,
              key,
            }));
            onChange?.(key);
            toast.success("File uploaded successfully");
            resolve();
          } else {
            reject(new Error("failed to upload file...."));
          }
        };
        xhr.onerror = () => {
          reject(new Error("failed to upload file...."));
        };
        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch {
      toast.error("failed to upload file");
      setFile((prev) => ({
        ...prev,
        error: true,
        uploading: false,
        progress: 0,
      }));
    }
  }

  // Accepted files
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        if (file.objectUrl && !file.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(file.objectUrl);
        }
        setFile({
          file: selectedFile,
          id: uuidv4(),
          uploading: false,
          progress: 0,
          error: false,
          isDeleting: false,
          objectUrl: URL.createObjectURL(selectedFile),
          fileType: "image",
        });
        uploadFile(selectedFile);
        setHasError(false); // clear error
        toast.success(`File "${selectedFile.name}" uploaded successfully!`);
        console.log(file.objectUrl);
        console.log("Accepted file:", selectedFile);
      }
    },
    [file.objectUrl]
  );
  async function handleRemove() {
    if (file.isDeleting || !file.objectUrl) return;
    try {
      setFile((prev) => ({
        ...prev,
        isDeleting: true,
      }));
      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: file.key,
        }),
      });
      if (!response.ok) {
        toast.error("Failed to emove file fron storage");
        setFile((prev) => ({
          ...prev,
          isDeleting: true,
          error: true,
        }));
        return;
      }
      if (file.objectUrl && !file.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(file.objectUrl);
      }
      onChange?.("");

      setFile(() => ({
        file: null,
        uploading: false,
        progress: 0,
        error: false,
        objectUrl: undefined,
        id: null,
        fileType: "image",
        isDeleting: false,
      }));
      toast.success("deleted");
    } catch {
      toast.error("Error removing file.please try again");
      setFile((prev) => ({
        ...prev,
        error: true,

        isDeleting: false,
      }));
    }
  }

  useEffect(() => {
    // if there is a previous object URL, revoke it when a new one is created or component unmounts
    return () => {
      if (file.objectUrl && !file.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(file.objectUrl);
      }
    };
  }, [file.objectUrl]);

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

  function renderContent() {
    if (file.uploading) {
      return (
        <RenderUploadingState
          file={file.file as File}
          progress={file.progress}
        />
      );
    }
    if (file.error) {
      return <RenderErrorState />;
    }
    if (file.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={file.objectUrl}
          handleRemoval={handleRemove}
          isDeleting={file.isDeleting}
        />
      );
    }
    return <RenderState isDragActive={isDragActive} />;
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { "image/*": [] },
    multiple: false,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: file.uploading || !!file.objectUrl,
  });

  return (
    <div
      {...getRootProps()}
      className={`min-h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-amber-500 "
            : hasError
              ? "border-red-500 "
              : "border-gray-300 hover:border-amber-500"
        }`}
    >
      <input {...getInputProps()} />

      {renderContent()}
    </div>
  );
}

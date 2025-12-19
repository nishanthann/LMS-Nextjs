import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import z from "zod";
import { v4 as uuidv4 } from "uuid";
import { S3 } from "@/lib/S3Client";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { requireAdmin } from "@/app/data/admin/require-admin";

const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "file name is required" }),

  contentType: z.string().min(1, { message: "content type is required" }),
  size: z.number().min(1, { message: "file size is required" }),
  isImage: z.boolean(),
});

const aj = arcjet.withRule(fixedWindow({ max: 2, window: "1m", mode: "LIVE" }));

export async function POST(request: Request) {
  const session = await requireAdmin();

  try {
    const decision = await aj.protect(request, {
      fingerprint: session?.user.id as string,
    });
    if (decision.isDenied()) {
      return NextResponse.json({ error: "Request blocked" }, { status: 429 });
    }
    const body = await request.json();
    const validation = fileUploadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "invalid data" }, { status: 400 });
    }
    const { fileName, contentType, size } = validation.data;
    const unique = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: unique,
      ContentType: contentType,
      ContentLength: size,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360,
      // Set of all x-amz-* headers you wish to have signed
    });
    const response = {
      presignedUrl,
      key: unique,
    };
    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";

import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { NextResponse } from "next/server";

const aj = arcjet
  .withRule(detectBot({ mode: "LIVE", allow: [] }))
  .withRule(fixedWindow({ max: 10, window: "1m", mode: "LIVE" }));

export async function DELETE(request: Request) {
  const session = await requireAdmin();

  try {
    const decision = await aj.protect(request, {
      fingerprint: session?.user.id as string,
    });
    if (decision.isDenied()) {
      return NextResponse.json({ error: "Request blocked" }, { status: 429 });
    }
    const body = await request.json();
    const key = body.key;
    if (!key) {
      return NextResponse.json(
        { error: "Misssing invalid key" },
        { status: 400 }
      );
    }
    const command = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: key,
    });
    await S3.send(command);
    return NextResponse.json({ message: "file deleted", status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Misssing invalid key" },
      { status: 500 }
    );
  }
}

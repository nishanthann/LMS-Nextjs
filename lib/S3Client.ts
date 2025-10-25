import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

export const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true,
  // credentials:{
  //     accessKeyId:process.env.S3_ACCESS_KEY as string,
  //     secretAccessKey:process.env.S3_SECRET_KEY as string
  // }
});

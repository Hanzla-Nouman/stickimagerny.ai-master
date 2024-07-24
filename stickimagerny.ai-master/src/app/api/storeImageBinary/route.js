import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
// import path from "path";
// import { writeFile } from "fs/promises";

export const POST = async (req, res) => {
  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://64afdea5e892c1c53be60e120e129a59.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: "4973743570efa28d469fe283d9eb3028",
      secretAccessKey: "eef387d8a3ce57417b4182173b7116622a0ebd057890d9efc5d6472250df834f",
    },
  });

  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename =  file.name.replaceAll(" ", "_");
  const contentType = file.type;

  const params = {
    Bucket: "stockimagery",
    Key: filename,
    Body: buffer,
    ContentType: contentType,
  };

  try {
    const uploadResult = await S3.send(new PutObjectCommand(params));
    const imageUrl = `https://pub-bc7b2289f5f5458f95dc4e654e76d6b6.r2.dev/${filename}`;
    return NextResponse.json({ url: imageUrl.trim() });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
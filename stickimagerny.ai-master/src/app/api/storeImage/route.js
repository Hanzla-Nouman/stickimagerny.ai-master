import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// export async function POST(req) {
//   const S3 = new S3Client({
//     region: "auto",
//     endpoint: `https://64afdea5e892c1c53be60e120e129a59.r2.cloudflarestorage.com`,
//     credentials: {
//       accessKeyId: "4973743570efa28d469fe283d9eb3028",
//       secretAccessKey:
//         "eef387d8a3ce57417b4182173b7116622a0ebd057890d9efc5d6472250df834f",
//     },
//   });

//   const reqData = await req.json();
//   const uuid = reqData.uuid;
//   const images = reqData.images;

//   const uploadedImages = [];
//   //console.log(JSON.stringify(images))
//   for (const [index, image] of images.entries()) {
//     const response = await fetch(image.url);
//     const arrayBuffer = await response.arrayBuffer(); // Convert to ArrayBuffer
//     const buffer = Buffer.from(arrayBuffer);
//     //const contentType = response.headers.get("content-type");
//     const contentType = image.content_type;
//     const params = {
//       Bucket: "stockimagery",
//       Key: `${uuid}-${index}.${contentType.split("/")[1]}`,
//       Body: buffer,
//       ContentType: contentType,
//     };

//     try {
//       const uploadResult = await S3.send(new PutObjectCommand(params));
//       const imageUrl = `https://pub-bc7b2289f5f5458f95dc4e654e76d6b6.r2.dev/${uuid}-${index}.${
//         contentType.split("/")[1]
//       }`;
//       uploadedImages.push({ url: imageUrl.trim() });
//     } catch (err) {
//       console.error(err);
//       return Response.json({ message: "Server error" }, { status: 500 });
//     }

//   }

//   return Response.json(uploadedImages);
// }



export async function POST(req) {
    const S3 = new S3Client({
      region: "auto",
      endpoint: `https://64afdea5e892c1c53be60e120e129a59.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: "4973743570efa28d469fe283d9eb3028",
        secretAccessKey:
          "eef387d8a3ce57417b4182173b7116622a0ebd057890d9efc5d6472250df834f",
      },
    });
  
    const reqData = await req.json();
    const uuid = reqData.uuid;
    const image = reqData.image;
    const index = reqData.index; 
    try {
      const response = await fetch(image.url);
      const arrayBuffer = await response.arrayBuffer(); // Convert to ArrayBuffer
      const buffer = Buffer.from(arrayBuffer);
      const contentType = image.content_type;
      const keySuffix = contentType.split("/")[1];
      const keyName = index ? `${uuid}-${index}.${keySuffix}` : `${uuid}.${keySuffix}`;
      const params = {
        Bucket: "stockimagery",
        Key: keyName,
        Body: buffer,
        ContentType: contentType,
      };
  
      const uploadResult = await S3.send(new PutObjectCommand(params));
      const imageUrl = index ? `https://pub-bc7b2289f5f5458f95dc4e654e76d6b6.r2.dev/${uuid}-${index}.${contentType.split("/")[1]}` : `https://pub-bc7b2289f5f5458f95dc4e654e76d6b6.r2.dev/${uuid}.${contentType.split("/")[1]}`;
      return Response.json({ url: imageUrl.trim() });
    } catch (err) {
      console.error(err);
      return Response.json({ message: "Server error" }, { status: 500 });
    }
  }

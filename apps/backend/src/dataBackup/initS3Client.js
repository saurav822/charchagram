import dotenv from "dotenv";
dotenv.config();

import { S3 } from "@aws-sdk/client-s3";
console.log("DO_SPACES_KEY:", process.env.DO_SPACES_KEY);
console.log("DO_SPACES_SECRET:", process.env.DO_SPACES_SECRET);
console.log("DO_SPACES_ENDPOINT:", process.env.DO_SPACES_ENDPOINT);
const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: "BLR1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

console.log("s3Client :", s3Client);

export { s3Client };

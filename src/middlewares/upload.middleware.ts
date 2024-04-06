import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { UserRequest } from "../types/express";

const region = process.env["S3_REGION"] || "";
const secretAccessKey = process.env["S3_SECRET_KEY"] || "";
const accessKeyId = process.env["S3_ACCESS_KEY"] || "";
const bucketName = process.env["S3_BUCKET_NAME"] || "";

const s3 = new S3Client({
  region,
  credentials: {
    secretAccessKey,
    accessKeyId,
  },
});

function generateKey(
  req: UserRequest,
  _file: Express.Multer.File,
  cb: (error: any, key?: string) => void,
) {
  const fileName = `${req.user!.userId}-profile_pic`;
  const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
  req.headers["fileLocation"] = imageUrl;
  cb(null, fileName);
}

const s3Storage = multerS3({
  s3: s3,
  bucket: bucketName,
  acl: "public-read",
  metadata: (_req, file, cb) => {
    cb(null, { ...file });
  },
  key: generateKey,
});

const upload = multer({
  storage: s3Storage,
  fileFilter: (_req, file, cb) => {
    const validExtensions = ["jpg", "jpeg", "png"];
    const extension = file.originalname.split(".").pop()?.toLowerCase();
    cb(null, validExtensions.includes(extension!));
  },
});

export default upload;

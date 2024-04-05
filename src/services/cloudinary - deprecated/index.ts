import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET_KEY) {
  throw new Error("Missing required Cloudinary environment variables.");
}

cloudinary.config({
  cloud_name: "dtobihpqi",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const fileToUint8 = async (filePath: string): Promise<Uint8Array> => {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const uint8Array = new Uint8Array(fileBuffer);
    console.log("uint8Array: ", uint8Array);
    return uint8Array;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
};

const uploadFileStream = async (
  path: string,
  options: { folder: string; ocr?: string }
): Promise<UploadApiResponse> => {
  const buffer = await fileToUint8(path);
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(buffer);
  });
};

export default uploadFileStream;

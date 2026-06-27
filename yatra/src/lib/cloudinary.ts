import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadResult = {
  url: string;
  fileId: string;
  fileName: string;
  mimeType: string;
  size: number;
};

const uploadOnCloudinary = async (
  file: File
): Promise<UploadResult | null> => {
  if (!file) return null;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: "partner-documents",
            resource_type: "auto",
          },
          (error, result) => {
            if (error || !result) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                fileId: result.public_id,
                fileName: file.name,
                mimeType: file.type,
                size: file.size,
              });
            }
          }
        );

      uploadStream.end(buffer);
    });
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default uploadOnCloudinary;
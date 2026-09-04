import "server-only";

import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import type { ValidatedLetterImage } from "@/lib/letters/validation";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const baseFolder = process.env.CLOUDINARY_FOLDER_NAME?.trim() || "minha-cartinha";

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    "Defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.",
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export type UploadedLetterImage = {
  assetId: string;
  publicId: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  size: number;
};

function imageDisplayName(image: ValidatedLetterImage) {
  if (image.role === "HERO") return "foto-principal";
  if (image.role === "FAVORITE_PLACE") return "lugar-favorito";
  return `momento-${image.position + 1}`;
}

export function uploadLetterImage(
  image: ValidatedLetterImage,
  uploadBatchId: string,
): Promise<UploadedLetterImage> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        asset_folder: `${baseFolder}/cartinhas/${uploadBatchId}`,
        display_name: imageDisplayName(image),
        overwrite: false,
        tags: ["minha-cartinha"],
      },
      (error, result) => {
        if (error) {
          reject(new Error("O Cloudinary não conseguiu receber uma das imagens.", { cause: error }));
          return;
        }
        if (!result) {
          reject(new Error("O Cloudinary não retornou os dados da imagem."));
          return;
        }

        resolve(uploadResult(result));
      },
    );

    stream.end(Buffer.from(image.bytes));
  });
}

function uploadResult(result: UploadApiResponse): UploadedLetterImage {
  return {
    assetId: result.asset_id,
    publicId: result.public_id,
    secureUrl: result.secure_url,
    format: result.format,
    width: result.width,
    height: result.height,
    size: result.bytes,
  };
}

export async function removeCloudinaryImages(publicIds: string[]) {
  const results = await Promise.allSettled(
    publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
      }),
    ),
  );

  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length) {
    console.error(`Não foi possível remover ${failed.length} imagem(ns) do Cloudinary.`);
  }
}

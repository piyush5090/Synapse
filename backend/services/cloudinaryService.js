// cloudinaryService.js
import dotenv from "dotenv";
dotenv.config();

import cloudinaryModule from "cloudinary";
import streamifier from "streamifier";

const cloudinary = cloudinaryModule.v2;

let initialized = false;

/**
 * Initialize Cloudinary client ONCE.
 * Call this inside index.js before using upload/delete functions.
 */
export function initCloudinary() {
  if (initialized) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("❌ Missing Cloudinary credentials in .env file.");
    throw new Error("Cloudinary initialization failed: Missing credentials");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  initialized = true;
  console.log("✅ Cloudinary initialized");
}

/**
 * Uploads an image buffer to Cloudinary.
 * @param {Buffer} imageBuffer 
 * @param {string} folder 
 * @returns {Promise<string>} secure URL
 */
export function uploadImage(imageBuffer, folder = "synapse_generated") {
  return new Promise((resolve, reject) => {
    if (!initialized) {
      return reject(new Error("Cloudinary not initialized"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        if (!result?.secure_url) {
          return reject(new Error("Cloudinary upload failed to return a URL"));
        }

        resolve(result.secure_url);
      }
    );

    // Convert buffer → readable stream → pipe to uploadStream
    streamifier.createReadStream(imageBuffer).pipe(uploadStream);
  });
}

/**
 * Deletes an image using its public ID.
 */
export function deleteImage(publicId) {
  return new Promise((resolve, reject) => {
    if (!initialized) {
      return reject(new Error("Cloudinary not initialized"));
    }

    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

/**
 * Extract Cloudinary public ID from URL.
 */
export function getPublicIdFromUrl(imageUrl) {
  try {
    const urlParts = imageUrl.split("/upload/");
    if (urlParts.length < 2) return null;

    const versionAndPath = urlParts[1].split("/");
    const pathWithoutVersion = versionAndPath[0].startsWith("v")
      ? versionAndPath.slice(1)
      : versionAndPath;

    const publicIdWithExtension = pathWithoutVersion.join("/");
    const dotIndex = publicIdWithExtension.lastIndexOf(".");
    return dotIndex === -1
      ? publicIdWithExtension
      : publicIdWithExtension.substring(0, dotIndex);
  } catch (err) {
    console.error("Error extracting public ID:", err);
    return null;
  }
}

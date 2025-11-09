   // Load environment variables
    require('dotenv').config();
    const cloudinary = require('cloudinary').v2; // Use v2 of the SDK
    const streamifier = require('streamifier'); // Helper to upload from buffer
    
    // --- Configure Cloudinary ---
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
        console.error("Error: Missing Cloudinary credentials in .env file.");
    } else {
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true // Use https
        });
        console.log("Cloudinary client configured.");
    }
    
    /**
     * Uploads an image buffer to Cloudinary.
     * @param {Buffer} imageBuffer - The image data received from the generation API.
     * @param {string} [folder='synapse_generated'] - Optional folder name in Cloudinary.
     * @returns {Promise<string|null>} The secure URL of the uploaded image, or null if error.
     */
    const uploadImage = (imageBuffer, folder = 'synapse_generated') => {
        return new Promise((resolve, reject) => {
            if (!cloudName || !apiKey || !apiSecret) {
                return reject(new Error("Cloudinary not configured due to missing credentials."));
            }
    
            // Use upload_stream to upload from buffer
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder, // Optional: Organize uploads in Cloudinary
                    // You can add tags, transformations etc. here if needed
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return reject(error);
                    }
                    if (result && result.secure_url) {
                        console.log('Image uploaded successfully to Cloudinary:', result.secure_url);
                        resolve(result.secure_url); // Return the secure URL
                    } else {
                         console.error('Cloudinary upload failed, no result or URL:', result);
                         reject(new Error('Cloudinary upload failed to return a secure URL.'));
                    }
                }
            );
    
            // Pipe the buffer to the upload stream
            streamifier.createReadStream(imageBuffer).pipe(uploadStream);
        });
    };
    
    /**
     * Deletes an image from Cloudinary using its public ID.
     * @param {string} publicId - The public ID of the image to delete.
     * @returns {Promise<object>} The result from Cloudinary delete API.
     */
    const deleteImage = (publicId) => {
         return new Promise((resolve, reject) => {
             if (!cloudName || !apiKey || !apiSecret) {
                 return reject(new Error("Cloudinary not configured."));
             }
             cloudinary.uploader.destroy(publicId, (error, result) => {
                 if (error) {
                     console.error(`Error deleting Cloudinary image ${publicId}:`, error);
                     return reject(error);
                 }
                 console.log(`Cloudinary image ${publicId} deletion result:`, result);
                 resolve(result); // Usually { result: 'ok' } or { result: 'not found' }
             });
         });
    };
    
    /**
     * Extracts the public ID from a Cloudinary URL.
     * Example URL: https://res.cloudinary.com/demo/image/upload/v1619598475/folder/synapse_generated/sample.jpg
     * Example Public ID: folder/synapse_generated/sample
     * @param {string} imageUrl - The Cloudinary image URL.
     * @returns {string|null} The public ID or null if parsing fails.
     */
    const getPublicIdFromUrl = (imageUrl) => {
         try {
             // Basic parsing, might need adjustment based on your Cloudinary setup (folders, versions etc.)
             const urlParts = imageUrl.split('/upload/');
             if (urlParts.length < 2) return null;
             const versionAndPath = urlParts[1];
             const pathParts = versionAndPath.split('/');
             // Remove version if present (like v1619598475)
             const pathWithoutVersion = pathParts[0].match(/^v\d+$/) ? pathParts.slice(1) : pathParts;
             // Remove file extension
             const publicIdWithExtension = pathWithoutVersion.join('/');
             const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
             if (lastDotIndex === -1) return publicIdWithExtension; // No extension
             return publicIdWithExtension.substring(0, lastDotIndex);
         } catch (e) {
             console.error("Error parsing public ID from URL:", imageUrl, e);
             return null;
         }
    };
    
    
    module.exports = {
        uploadImage,
        deleteImage,
        getPublicIdFromUrl
    };
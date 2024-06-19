import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for user images
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user_images',
        allowed_formats: ['jpg', 'png'],
        transformation: [{ width: 200, height: 200, crop: "fill" }],
    },
});

// Storage for PDF and video content
const contentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'content',
        allowed_formats: ['pdf', 'mp4', 'mov', 'doc'],
        resource_type: 'auto', // This allows uploading of different file types like videos
    },
});

export { cloudinary, imageStorage, contentStorage };

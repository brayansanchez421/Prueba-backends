import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configura Cloudinary con tus credenciales
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage para imágenes de usuario
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user_images',
        allowed_formats: ['jpg', 'png'],
        transformation: [{ width: 200, height: 200, crop: 'fill' }],
    },
});

// Storage para contenido PDF y video
const contentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let resourceType = 'auto';
        if (file.mimetype === 'application/pdf') {
            resourceType = 'auto'; // Usa auto para PDFs
        } else if (file.mimetype.startsWith('video/')) {
            resourceType = 'video'; // Usa video para videos
        }
        return {
            folder: 'content',
            format: file.mimetype.split('/')[1], // Usa la extensión del archivo
            resource_type: resourceType, // Configura el tipo de recurso dinámicamente
            allowed_formats: ['pdf', 'mp4', 'avi', 'mkv', 'jpg', 'png'], // Agrega todos los formatos permitidos aquí
        };
    },
});

const upload = multer({ storage: contentStorage });

export { cloudinary, imageStorage, contentStorage, upload };

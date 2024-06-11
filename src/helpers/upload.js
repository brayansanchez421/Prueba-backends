import multer from 'multer';
import { imageStorage, contentStorage } from './cloudinaryConfig.js';

const uploadImage = multer({ storage: imageStorage });
const uploadContent = multer({ storage: contentStorage });
const upload = multer();


export { uploadImage, uploadContent, upload };

import multer from 'multer';
import { storage } from './cloudinaryConfig.js';

const upload = multer({ storage: storage });

export default upload;

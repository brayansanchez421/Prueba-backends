import { Router } from "express";

import { createCategory, getCategories } from "../../controllers/courses/category.controller.js";

const router = Router();
import { uploadImage, uploadContent } from '../../helpers/upload.js';



router.post('/createCategory', uploadImage.single('image'), createCategory);
router.get('/getCategories', getCategories);



export default router;
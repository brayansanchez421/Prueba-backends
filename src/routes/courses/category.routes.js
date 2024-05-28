import { Router } from "express";

import { createCategory, getCategories } from "../../controllers/courses/category.controller.js";

const router = Router();
import upload from '../../helpers/upload.js';



router.post('/createCategory', upload.single('image'), createCategory);
router.get('/getCategories', getCategories);



export default router;
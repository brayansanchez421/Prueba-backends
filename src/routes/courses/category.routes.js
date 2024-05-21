import { Router } from "express";

import { createCategory, getCategories } from "../../controllers/courses/category.controller.js";

const router = Router();


router.post('/createCategory', createCategory);
router.get('/getCategories', getCategories);



export default router;
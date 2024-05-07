import { Router } from "express";

import { createCategory } from "../../controllers/courses/category.controller.js";

const router = Router();


router.post('/createCategory', createCategory);


export default router;
import { Router } from "express";
import upload from '../../helpers/upload.js';


import { createCourse, getAllCourses, getCourse , updateCourse, deleteCourse, getCoursesByCategory} from "../../controllers/courses/course.controller.js";

const router = Router();

router.get('/getAllCourses', getAllCourses);
router.get('/getCourse/:id', getCourse);
router.get('/category/:categoryName', getCoursesByCategory);

router.post('/createCourse', upload.single('image'), createCourse);
router.put('/updateCourse/:id', updateCourse);
router.delete('/deleteCourse/:id', deleteCourse);


export default router;
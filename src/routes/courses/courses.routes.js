import { Router } from "express";
import { uploadImage, uploadContent } from '../../helpers/upload.js';


import { 
    createCourse, 
    getAllCourses, 
    getCourse, 
    updateCourse, 
    deleteCourse, 
    getCoursesByCategory,
    asignarContenido // Importar la función asignarContenido
} from "../../controllers/courses/course.controller.js";

const router = Router();

router.get('/getAllCourses', getAllCourses);
router.get('/getCourse/:id', getCourse);
router.get('/category/:categoryName', getCoursesByCategory);

// Use uploadImage for creating a course with an image
router.post('/createCourse', uploadImage.single('image'), createCourse);
router.post('/asignarContenido/:id', uploadContent.single('content'), asignarContenido);


// If you have an endpoint that requires uploading content (e.g., PDFs or videos)

router.put('/updateCourse/:id', uploadImage.single('image'), updateCourse);
router.put('/updateCourse/:id', updateCourse);
router.delete('/deleteCourse/:id', deleteCourse);

export default router;

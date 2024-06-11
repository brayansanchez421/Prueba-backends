import { Router } from "express";
import { updateUser, getUser, deleteUser, getAllUsers, deleteUserConfirmation, createUser, registerToCourse, getUserCourses } from "../../controllers/user/user.controller.js";
import { uploadImage, uploadContent } from '../../helpers/upload.js';

import { checkPermissions } from "../../middlewares/permission.middleware.js";
import { authRequired } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/getAll", getAllUsers);

router.get("/get/:id",  getUser);
router.post("/createUser",  createUser);
router.post('/registerToCourse', registerToCourse);
router.get('/:userId/courses', getUserCourses);




router.put('/modify/:id', uploadImage.single('userImage'), updateUser);

router.delete("/delete/:id", deleteUser);
router.delete("/delete/:id/confirm",deleteUserConfirmation);

export default router;

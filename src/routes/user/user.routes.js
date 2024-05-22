import { Router } from "express";
import { updateUser, getUser, deleteUser, getAllUsers, deleteUserConfirmation, createUser } from "../../controllers/user/user.controller.js";
import upload from '../../helpers/upload.js';

import { checkPermissions } from "../../middlewares/permission.middleware.js";
import { authRequired } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/getAll", getAllUsers);

router.get("/get/:id",  getUser);
router.post("/createUser",  createUser);


router.put('/modify/:id', upload.single('image'), updateUser);

router.delete("/delete/:id", deleteUser);
router.delete("/delete/:id/confirm",deleteUserConfirmation);

export default router;

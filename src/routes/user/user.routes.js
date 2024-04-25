import { Router } from "express";
import { updateUser, getUser, deleteUser, getAllUsers, deleteUserConfirmation } from "../../controllers/user/user.controller.js";

import { checkPermissions } from "../../middlewares/permission.middleware.js";
import { authRequired } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/getAll", getAllUsers);

router.get("/get/:id",  getUser);

router.put("/modify/:id", updateUser);

router.delete("/delete/:id", deleteUser);
router.delete("/delete/:id/confirm",deleteUserConfirmation);

export default router;

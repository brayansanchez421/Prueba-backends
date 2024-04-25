import {getRoles, createRole, updateRole, deleteRole, getRole} from '../../controllers/user/role.controller.js';
import { Router } from "express";


import { checkPermissions } from "../../middlewares/permission.middleware.js";

const router = Router();

router.post('/createRole', createRole);
router.get('/getRoles', getRoles);
router.get('/getRole/:id', getRole);

router.put('/updateRole/:id', updateRole);
router.delete('/deleteRole/:id', deleteRole);
export default router;

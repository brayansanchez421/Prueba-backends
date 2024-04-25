import {getPermissions, createPermission, updatePermission, deletePermission} from '../../controllers/user/permission.controller.js';
import { Router } from "express";




const router = Router();

router.post('/createPermission',  createPermission);
router.get('/getPermissions', getPermissions);
router.put('/updatePermission/:id',  updatePermission);
router.delete('/deletePermission/:id', deletePermission);
export default router;

import { Router } from "express";
const routes = Router();
import UserRoutes from "./user.routes.js";
import PermissionRoutes from "./permission.routes.js";
import RolesRoutes from "./role.routes.js";
import { checkPermissions } from "../../middlewares/permission.middleware.js";

routes.use("/users",UserRoutes);
routes.use("/permissions", PermissionRoutes);
routes.use("/roles", RolesRoutes);

export default routes;

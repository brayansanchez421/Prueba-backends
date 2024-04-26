import { Router } from "express";
const routes = Router();
import UserRoutes from "./user.routes.js";
import PermissionRoutes from "./permission.routes.js";
import RolesRoutes from "./role.routes.js";
import { checkPermissions } from "../../middlewares/permission.middleware.js";

routes.use("/users", checkPermissions(["UserPermission"]),UserRoutes);
routes.use("/permissions",checkPermissions(["RolePermission"]), PermissionRoutes);
routes.use("/roles",checkPermissions(["RolePermission"]), RolesRoutes);

export default routes;

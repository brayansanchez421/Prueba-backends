import { Router } from "express";
const routes = Router();
import CoursesRoutes from "./courses.routes.js";
import CategoryRoutes from "./category.routes.js";


routes.use("/courses", CoursesRoutes);

routes.use("/category", CategoryRoutes);

export default routes;
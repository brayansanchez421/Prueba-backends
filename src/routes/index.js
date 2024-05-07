import { Router } from "express";
const routes = Router();
import auth from "./auth.routes.js";
import users from "./user/index.js";
import courses from './courses/index.js'
import { authRequired } from "../middlewares/auth.middleware.js";

routes.use("/", auth);
routes.use("/" , users);
routes.use("/" , courses);

export default routes;

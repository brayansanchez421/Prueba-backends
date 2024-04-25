import { Router } from "express";
const routes = Router();
import auth from "./auth.routes.js";
import users from "./user/index.js";
import { authRequired } from "../middlewares/auth.middleware.js";

routes.use("/", auth);
routes.use("/" , users);

export default routes;

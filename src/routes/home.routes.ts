import { Router } from "express";
import homeController from "../controllers/home.controller";

const homeRoutes = Router();

homeRoutes.get("/", homeController.getHomePage);

export default homeRoutes;

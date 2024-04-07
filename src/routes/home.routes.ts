import { Router } from "express";
import homeController from "../controllers/home.controller";

const homeRoutes = Router();

/**
 * @swagger
 * /home:
 *  get:
 *      summary: get Home page
 *      tags: [Home]
 *      description: This endpoint shows the user's profile page. 
 */
homeRoutes.get("/", homeController.getHomePage);

export default homeRoutes;

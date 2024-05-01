import { Router } from "express";
import homeController from "../controllers/home.controller";
import newUserMiddleware from "../middlewares/user-new.middleware";

const homeRoutes = Router();

/**
 * @swagger
 * /home:
 *  get:
 *      summary: get Home page
 *      tags: [Home]
 *      description: This endpoint shows the user's profile page.
 */

homeRoutes.use(newUserMiddleware);

homeRoutes.get("/logout", homeController.logout);

homeRoutes.get("/", homeController.getHomePage);

homeRoutes.get("/profile", homeController.getProfilePage);

homeRoutes.get("/likes", homeController.getYourLikesPage);

homeRoutes.get("/matches", homeController.getMatchesPage);

export default homeRoutes;

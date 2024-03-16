// handles routing for every http request on '/users'
import { Router } from "express";
import userController from "../controllers/user.controller";

const userRoutes = Router();

// 'GET /users'
userRoutes.get("/", userController.getUsers);

export default userRoutes;

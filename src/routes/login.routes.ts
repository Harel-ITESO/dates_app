// handles login routing
import { Router } from "express";
import loginController from "../controllers/login.controller";

const loginRoutes = Router();

// 'GET /login' -- TODO
loginRoutes.get("/", loginController.getLoginPage);

// 'POST /login'
loginRoutes.post("/", loginController.loginUser);

export default loginRoutes;

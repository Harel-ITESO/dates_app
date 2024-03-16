// handles register routing
import { Router } from "express";
import registerController from "../controllers/register.controller";

const registerRoutes = Router();

// 'GET /register' -- TODO
registerRoutes.get("/", registerController.getRegisterPage);

// 'POST /register'
registerRoutes.post("/", registerController.registerUser);

export default registerRoutes;

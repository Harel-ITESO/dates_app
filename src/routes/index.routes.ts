// handles all routing

import { Router } from "express";
import userRoutes from "./user.routes";
import loginRoutes from "./login.routes";
import registerRoutes from "./register.routes";
import authMiddleware from "../middlewares/auth.middleware";
import homeRoutes from "./home.routes";
import fileRoutes from "./file.routes";

const indexRoutes = Router();

// 'redirect to home'
indexRoutes.get("/", (_, res) => res.redirect("/home"));

indexRoutes.use("/home", authMiddleware, homeRoutes);

// '/users'
indexRoutes.use("/users", authMiddleware, userRoutes);

// '/login'
indexRoutes.use("/login", loginRoutes);

// '/register'
indexRoutes.use("/register", registerRoutes);

// '/files'
indexRoutes.use("/files", authMiddleware, fileRoutes);

export default indexRoutes;

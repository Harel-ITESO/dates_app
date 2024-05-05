// handles all routing

import { Router } from "express";
import userRoutes from "./user.routes";
import loginRoutes from "./login.routes";
import registerRoutes from "./register.routes";
import authMiddleware from "../middlewares/auth.middleware";
import homeRoutes from "./home.routes";
import fileRoutes from "./file.routes";
import onboardingRoutes from "./onboarding.routes";
import matchRoutes from "./match.routes";
import { interestModel } from "../models/model-pool";

const indexRoutes = Router();

// 'redirect to home'

/**
 * @swagger
 * /:
 *  get:
 *      summary: Redirect to Home
 *      tags: [Home]
 *      description: Redirects requests from the root URL to the home page.
 *      responses:
 *          '302':
 *              description: Found. Redirecting to /home.
 *              headers:
 *                  Location:
 *                      schema:
 *                          type: string
 *                          example: '/home'
 *                      description: The URL to which the request is redirected.
 */
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

// '/onboarding'
indexRoutes.use("/onboarding", authMiddleware, onboardingRoutes);

// testing

indexRoutes.post("/interests", async (req, res) => {
  const { interests } = req.body;
  interests.forEach(async (e: { interestDescription: string }) => {
    await interestModel.create({
      data: { interestDescription: e.interestDescription },
    });
  });
  res.send("created");
});

indexRoutes.get("/interests", async (_req, res) => {
  res.json(await interestModel.findMany({}));
});

// '/match'
indexRoutes.use("/match", authMiddleware, matchRoutes);

export default indexRoutes;

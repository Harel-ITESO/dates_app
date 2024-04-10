import { Router } from "express";
import onboardingController from "../controllers/onboarding.controller";

const onboardingRoutes = Router();

// 'GET' /onboarding
onboardingRoutes.get("/", onboardingController.getOnboardingPage);

export default onboardingRoutes;

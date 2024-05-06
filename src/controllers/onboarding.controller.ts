import { interestModel } from "../models/model-pool";
import { Request, Response } from "express";

class OnboardingController {
  async getOnboardingPage(req: Request, res: Response) {
    if (!req.user!.isNew) res.redirect("/");
    const { password, ...userData } = req.user!;
    return res.render("onboarding", {
      layout: "plain",
      subtitle: "Onboarding",
      userData,
      interests: await interestModel.findMany({}),
    });
  }
}

export default new OnboardingController();

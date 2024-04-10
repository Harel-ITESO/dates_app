import { interestModel } from "../models/model-pool";
import { UserRequest } from "../types/global";
import { Response } from "express";

class OnboardingController {
  async getOnboardingPage(req: UserRequest, res: Response) {
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

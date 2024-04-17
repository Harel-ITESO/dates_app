import { interestModel } from "../models/model-pool";
import { UserRequest } from "../types/global";
import { Response } from "express";
import { StatusCodes } from "../utils/status-codes";

class HomeController {
  public getHomePage(req: UserRequest, res: Response) {
    const { password, ...rest } = req.user!;
    rest.profilePic =
      rest.profilePic || "/public/img/profile-pic-placeholder.jpg";
    return res.render("home", { subtitle: "Main", user: rest });
  }

  public async getProfilePage(req: UserRequest, res: Response) {
    const { password, ...rest } = req.user!;
    const { interestsIds } = rest;
    const interests = [] as string[];
    for (let i = 0; i < interestsIds.length; i++) {
      const interest = await interestModel.findFirst({
        where: { interestId: interestsIds[i] },
      });
      interests.push(interest!.interestDescription);
    }
    return res.render("home_profile", {
      subtitle: "Profile",
      user: rest,
      interests,
      scripts: ["/public/js/profile.js"],
    });
  }

  public async getYourLikesPage(req: UserRequest, res: Response) {
    const { password, ...rest } = req.user!;
    const opts = { user: rest.hasSuscription ? rest : null, subtitle: "Likes" };
    if (!rest.hasSuscription)
      return res
        .status(StatusCodes.FORBIDDEN)
        .render("forbidden_likespage", opts);
    // for the moment, this is the placeholder
    res.render("likespage", opts);
  }

  public logout(_req: UserRequest, res: Response) {
    res
      .clearCookie("authorization")
      .status(StatusCodes.ACCEPTED)
      .send("Logged out");
  }
}

export default new HomeController();

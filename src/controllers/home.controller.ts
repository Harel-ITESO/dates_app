import { interestModel, likeModel, userModel } from "../models/model-pool";
import { UserRequest } from "../types/global";
import { Response } from "express";
import { StatusCodes } from "../utils/status-codes";

class HomeController {
  public async getHomePage(req: UserRequest, res: Response) {
    const { password, ...user } = req.user!;
    // filter which users not to show if they were already liked/disliked
    const filteredUserIds = (
      await likeModel.findMany({
        select: {
          toUserId: true,
        },
        where: {
          fromUserId: user.userId,
        },
      })
    ).map((u) => u.toUserId);

    const otherUsers = await userModel.findMany({
      where: {
        userId: {
          not: user.userId,
          notIn: filteredUserIds,
        },
      },
    });

    res.render("home", {
      otherUsers,
      scripts: ["/public/js/home_main.js"],
    });
  }

  public async getProfilePage(req: UserRequest, res: Response) {
    const { password, userInterests, ...rest } = req.user!;
    const interestIds = userInterests.map((ui) => ui.interestId);
    const allInterests = await interestModel.findMany();
    const userInterestsData = await interestModel.findMany({
      where: {
        interestId: { in: interestIds },
      },
    });

    res.render("home_profile", {
      user: rest,
      userInterests: userInterestsData,
      allInterests,
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

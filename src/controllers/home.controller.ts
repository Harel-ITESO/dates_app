import {
  interestModel,
  likeModel,
  matchModel,
  userModel,
} from "../models/model-pool";
import { Request, Response } from "express";
import { StatusCodes } from "../utils/status-codes";

class HomeController {
  public async getHomePage(req: Request, res: Response) {
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
        isNew: false,
      },
    });

    res.render("home", {
      otherUsers,
      scripts: ["/public/js/home_main.js"],
      subtitle: "Home",
    });
  }

  public async getProfilePage(req: Request, res: Response) {
    const { password, userInterests, ...rest } = req.user!;
    const interestIds = userInterests!.map((ui) => ui.interestId);
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

  public async getYourLikesPage(req: Request, res: Response) {
    const { password, ...rest } = req.user!;
    const opts = { user: rest.hasSuscription ? rest : null, subtitle: "Likes" };
    if (!rest.hasSuscription)
      return res
        .status(StatusCodes.FORBIDDEN)
        .render("forbidden_likespage", opts);
    // for the moment, this is the placeholder
    res.render("premium", opts);
  }

  public async getMatchesPage(req: Request, res: Response) {
    const thisUser = req.user!;
    const userMatches = await matchModel.findMany({
      where: {
        OR: [
          {
            firstUserId: thisUser.userId,
          },
          {
            secondUserId: thisUser.userId,
          },
        ],
      },
      include: {
        secondUser: {
          select: {
            userId: true,
            profilePic: true,
            username: true,
          },
        },
        firstUser: {
          select: {
            userId: true,
            profilePic: true,
            username: true,
          },
        },
        Chat: {
          include: {
            messages: {
              select: {
                textContent: true,
                sendAt: true,
                senderId: true,
              },
              orderBy: {
                sendAt: "desc",
              },
            },
          },
        },
      },
    });

    const matches = userMatches.map((um) => {
      // find which user is not the current user
      const secondUser =
        thisUser.userId === um.firstUser.userId ? um.secondUser : um.firstUser;
      const currentChat = um.Chat[0];
      return {
        matchId: um.matchId,
        secondUserId: secondUser.userId,
        profilePic: secondUser.profilePic,
        username: secondUser.username,
        lastMessageTime: currentChat.messages[0]
          ? currentChat.messages[0].sendAt
          : "No tienes mensajes todavía",
      };
    });
    res.render("home_matches", {
      matches,
      subtitle: "Matches",
    });
  }

  public logout(_req: Request, res: Response) {
    res
      .clearCookie("authorization")
      .status(StatusCodes.ACCEPTED)
      .send("Logged out");
  }
}

export default new HomeController();

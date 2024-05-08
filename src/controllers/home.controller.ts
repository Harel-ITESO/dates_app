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
      user,
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

  public async getOtherProfilePage(req: Request, res: Response) {
    try {
      const { password, ...rest } = req.user!;
      const otherUserId = parseInt(req.params["id"]);
      if (!otherUserId)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send("other user id must be provided correctly");

      if (otherUserId === req.user!.userId)
        return res.redirect("/home/profile");

      const otherUser = await userModel.findFirst({
        where: {
          userId: otherUserId,
        },
      });

      if (!otherUser)
        return res
          .status(StatusCodes.NOT_FOUND)
          .render("profile_404", { user: rest });

      return res.render("other_profile", {
        subtitle: `${otherUser.username}`,
        otherUser,
        user: rest,
      });
    } catch (e: any) {
      res.status(StatusCodes.BAD_REQUEST).send();
    }
  }

  public async getYourLikesPage(req: Request, res: Response) {
    const { password, ...rest } = req.user!;
    if (!rest.hasSuscription)
      return res
        .status(StatusCodes.FORBIDDEN)
        .render("forbidden_likespage", { user: rest, subtitle: "Likes" });

    const invalidUserIds = (
      await matchModel.findMany({
        where: {
          OR: [
            {
              firstUserId: rest.userId,
            },
            {
              secondUserId: rest.userId,
            },
          ],
        },
      })
    ).map((m) => {
      if (m.firstUserId === rest.userId) return m.secondUserId;
      return m.firstUserId;
    });

    const otherUsers = (
      await likeModel.findMany({
        where: {
          toUserId: rest.userId,
          fromUserId: {
            notIn: invalidUserIds,
          },
        },
        include: {
          fromUser: true,
        },
      })
    ).map((l) => {
      return {
        userId: l.fromUser.userId,
        profilePic: l.fromUser.profilePic,
        username: l.fromUser.username,
      };
    });

    res.render("likespage", {
      user: rest,
      otherUsers,
      subtitle: "Likes",
      scripts: ["/public/js/likespage.js"],
    });
  }

  public async getMatchesPage(req: Request, res: Response) {
    const thisUser = req.user!;
    const { password, ...rest } = thisUser;
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
      user: rest,
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

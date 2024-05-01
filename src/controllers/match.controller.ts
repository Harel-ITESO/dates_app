import { Response } from "express";
import { UserRequest } from "../types/global";
import { StatusCodes } from "../utils/status-codes";
import { likeModel, matchModel } from "../models/model-pool";

// this controller handles both the match and likes between users (Since this events are strongly related)
class MatchController {
  // creates a new like, then tries to find if a mutual like exists, if so, creates a new match
  public async handleMatchLikeFromCurrentUser(req: UserRequest, res: Response) {
    const toUserId = Number.parseInt(req.query["toUserId"] as string) || 0;
    const thisUserId = req.user!.userId;
    const isLike = req.query["isLike"] === "0" ? false : true;

    if (!toUserId)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("other user id must be provided");
    if (toUserId === thisUserId)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Other user cannot be yourself");

    if (
      await likeModel.findFirst({
        where: { fromUserId: thisUserId, toUserId: toUserId },
      })
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("This like already exists");
    }

    try {
      // create the like
      await likeModel.create({
        data: {
          fromUser: {
            connect: {
              userId: thisUserId,
            },
          },
          toUser: {
            connect: {
              userId: toUserId,
            },
          },
          isLike,
        },
      });

      // if it's not a like, then just create it and return
      if (!isLike)
        return res.status(StatusCodes.CREATED).send("Dislike created");

      // search if a mutual like exists
      const mutualLike = await likeModel.findFirst({
        where: {
          fromUserId: toUserId,
          toUserId: thisUserId,
          isLike: true,
        },
      });

      if (mutualLike) {
        const match = await matchModel.create({
          select: {
            matchId: true,
          },
          data: {
            firstUser: {
              connect: {
                userId: thisUserId,
              },
            },
            secondUser: {
              connect: {
                userId: toUserId,
              },
            },
            Chat: {
              create: {},
            },
          },
        });
        return res
          .status(StatusCodes.ACCEPTED)
          .json({ matchId: match.matchId });
      }
      return res.status(StatusCodes.CREATED).send("Like created");
    } catch (e: any) {
      console.error(e);
    }
  }

  // get chats page
  public async getMatchChatPage(req: UserRequest, res: Response) {
    try {
      const thisUser = req.user!;
      const matchId = Number.parseInt(req.params["id"]);
      if (!matchId)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send("Invalid id was provided");

      // look for match
      const match = await matchModel.findFirst({
        where: {
          matchId,
        },
        include: {
          Chat: {
            include: {
              messages: true,
            },
          },
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
        },
      });
      if (!match)
        return res.status(StatusCodes.BAD_REQUEST).send("Match does not exist");

      // if the requesting user does not belong to the match, send FORBIDDEN

      if (
        match.firstUserId !== thisUser.userId &&
        match.secondUserId !== thisUser.userId
      )
        return res
          .status(StatusCodes.FORBIDDEN)
          .send("You are not part of this match");

      // filter and select just the necessary data
      const secondUser =
        thisUser.userId === match.secondUserId
          ? match.firstUser
          : match.secondUser;
      // set css class name for inmediate rendering
      const messages = match.Chat[0].messages.map((m) => {
        const { sendAt, ...rest } = m;
        const cssClassName =
          m.senderId === thisUser.userId ? "this-user-msg" : "other-user-msg";
        const msgTime = sendAt.toLocaleTimeString("es-MX");
        return { cssClassName, sendAt: msgTime, ...rest };
      });
      res.render("match_chat", {
        layout: "",
        secondUser,
        messages,
        thisUserId: thisUser.userId,
        scripts: ["/socket.io/socket.io.js", "/public/js/chat.js"],
      });
    } catch (e: any) {
      console.error(e);
    }
  }
}

export default new MatchController();

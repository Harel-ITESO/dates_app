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
    const isLike = req.headers["isLike"] === "0" ? false : true;

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
    )
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("This like already exists");

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
        },
      });

      if (mutualLike) {
        await matchModel.create({
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
        return res.status(StatusCodes.ACCEPTED).send("Like and Match created");
      }
    } catch (e: any) {
      console.error(e);
    }
  }
}

export default new MatchController();

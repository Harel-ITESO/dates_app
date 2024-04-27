// all actions for '/users'

import { Request, Response } from "express";
import { userInterestModel, userModel } from "../models/model-pool";
import { UserRequest } from "../types/global";
import { StatusCodes } from "../utils/status-codes";
import { Interest } from "@prisma/client";

class UserController {
  public async getUsers(_req: Request, res: Response) {
    res.json(await userModel.findMany({}));
  }

  public async getUserById(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    res.json(await userModel.findFirst({ where: { userId: id } }));
  }

  public async updateCurrentUserData(req: UserRequest, res: Response) {
    const { data } = req.body;
    const { userId } = req.user!;
    if (Object.keys(data).find((k) => k === "userInterests"))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Use the dedicated endpoint for updating the user interests");
    try {
      await userModel.update({
        where: { userId },
        data,
      });
      res.status(StatusCodes.ACCEPTED).send("Data updated succesfully");
    } catch (e: any) {
      console.error(e);
      res.status(StatusCodes.BAD_REQUEST).send(e.message);
    }
  }

  // updates or inserts the user interests (Since updating interests requires more work, a dedicated controller is made)
  public async upsertUserInterests(req: UserRequest, res: Response) {
    const thisUserId = req.user!.userId;
    const newInterests = req.body["interests"] as Interest[] | null;
    if (!newInterests)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("New interests array must be provided");
    if (newInterests.length > 5)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("No more than 5 interests are provided");

    // find duplicates (Since this must be 5 length at max, max iterations are 25 so this is actually optimal)
    for (let i = 0; i < newInterests.length; i++) {
      for (let j = 0; j < newInterests.length; j++) {
        if (i !== j && newInterests[i] === newInterests[j])
          return res
            .status(StatusCodes.BAD_REQUEST)
            .send("Interests can't be duplicated");
      }
    }

    // update or insert interests
    try {
      for (let i = 0; i < newInterests.length; i++) {
        await userInterestModel.upsert({
          create: {
            userId: thisUserId,
            interestId: newInterests[i].interestId,
          },
          update: {
            userId: thisUserId,
            interestId: newInterests[i].interestId,
          },
          where: {
            interestId_userId: {
              userId: thisUserId,
              interestId: newInterests[i].interestId,
            },
          },
        });
      }
      return res
        .status(StatusCodes.ACCEPTED)
        .send("Interests updated or inserted succesfully");
    } catch (e: any) {
      console.error(e);
    }
  }
}

export default new UserController();

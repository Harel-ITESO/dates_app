// all actions for '/users'

import { Request, Response } from "express";
import { userModel } from "../models/model-pool";
import { UserRequest } from "../types/global";
import { StatusCodes } from "../utils/status-codes";
import { Interest } from "@prisma/client";

class UserController {
  public async getUsers(_req: Request, res: Response) {
    res.json(await userModel.findMany({}));
  }

  public async getUserById(req: Request, res: Response) {
    const id = req.params.id;
    res.json(await userModel.findFirst({ where: { userId: id } }));
  }

  public async updateCurrentUserData(req: UserRequest, res: Response) {
    const { data } = req.body;
    const { userId } = req.user!;
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

  // attaches interests to the user making the petition
  public async attachCurrentUserInterest(req: UserRequest, res: Response) {
    try {
      const user = req.user!;
      const interests = req.body["interests"] as Interest[];
      if (interests.length > 5)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send("Can't have more than 5 interests");

      // since it is just 5 elements at must, it doesn't affect performance at all (Max iterations are 25) -- Find repeated elements
      const n = interests.length;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (interests[i].interestId === interests[j].interestId && i !== j)
            return res
              .status(StatusCodes.BAD_REQUEST)
              .send("Can't have repeatedx id elements");
        }
      }
      const interestsIds = interests.map((i) => i.interestId);
      await userModel.update({
        where: { userId: user.userId },
        data: { interestsIds: interestsIds },
      });

      res.status(StatusCodes.CREATED).send("Interests added");
    } catch (e: any) {
      console.error(e);
      res.status(StatusCodes.BAD_REQUEST).send(e.message);
    }
  }
}

export default new UserController();

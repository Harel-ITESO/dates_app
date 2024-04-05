// all actions for '/users'

import { Request, Response } from "express";
import { userModel } from "../models/model-pool";

class UserController {
  public async getUsers(_req: Request, res: Response) {
    res.json(await userModel.findMany({}));
  }
}

export default new UserController();

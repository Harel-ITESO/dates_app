// all actions for '/users'

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// user model
const userModel = new PrismaClient().user;

class UserController {
    public async getUsers(_req: Request, res: Response) {
        res.json(await userModel.findMany({}));
    }
}

export default new UserController();

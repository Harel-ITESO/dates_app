import { Response } from "express";
import { UserRequest } from "../types/express";
import { userModel } from "../models/model-pool";
import { StatusCodes } from "../utils/status-codes";

class FileController {
  public async uploadProfilePic(req: UserRequest, res: Response) {
    const { fileLocation } = req.headers;
    console.log(fileLocation);
    req.user!.profilePic = fileLocation as string;
    const { userId, ...data } = req.user!;
    try {
      const { userId } = await userModel.update({
        where: { userId: req.user!.userId },
        data,
      });
      res
        .status(StatusCodes.ACCEPTED)
        .send("Profile pic uploaded successfully to user " + userId);
    } catch (e: any) {
      console.error(e.message);
    }
  }
}

export default new FileController();

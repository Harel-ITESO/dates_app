import { Request, Response } from "express";
import { userModel } from "../models/model-pool";
import { StatusCodes } from "../utils/status-codes";

class FileController {
  public async uploadProfilePic(req: Request, res: Response) {
    const { fileLocation } = req.headers;
    req.user!.profilePic = fileLocation as string;
    const { userId } = req.user!;
    try {
      const user = await userModel.update({
        select: {
          userId: true,
        },
        where: {
          userId: userId,
        },
        data: {
          profilePic: fileLocation as string,
        },
      });
      res
        .status(StatusCodes.ACCEPTED)
        .send("Profile pic uploaded successfully to user " + user.userId);
    } catch (e: any) {
      console.error(e.message);
    }
  }
}

export default new FileController();

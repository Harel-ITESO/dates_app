// handles all '/login' actions
import { Request, Response } from "express";
import { StatusCodes } from "../utils/status-codes";
import { comparePassword } from "../utils/crypt";
import { generateToken } from "../utils/token";
import { userModel } from "../models/model-pool";

class LoginController {
  public getLoginPage(_req: Request, res: Response) {
    res.render("login", {
      layout: "forms",
      scripts: ["/socket.io/socket.io.js", "/public/js/login_request.js"],
    });
  }

  public async loginUser(req: Request, res: Response) {
    const { email, password } = req.body["user"];
    if (!email || !password) {
      res.status(StatusCodes.BAD_REQUEST).send("Missing correct fields");
      return;
    }
    const user = await userModel.findFirst({
      where: {
        email: email as string,
      },
    });
    if (!user || !comparePassword(password, user.password!)) {
      res.status(StatusCodes.NOT_FOUND).send("User was not found");
      return;
    }
    const token = generateToken(user.email, user.password!);
    res
      .cookie("authorization", token, { httpOnly: true })
      .status(StatusCodes.OK)
      .json(token);
  }

  // redirection on fail is managed by the google strategy
  public async loginUserFromGoogleRedirect(req: Request, res: Response) {
    const user = req.user;
    const token = generateToken(user!.email, user!.username);
    res
      .cookie("authorization", token, { httpOnly: true })
      .status(StatusCodes.OK)
      .redirect("/home");
  }
}

export default new LoginController();

import { UserRequest } from "../types/global";
import { Response } from "express";

class HomeController {
  public getHomePage(req: UserRequest, res: Response) {
    const { password, ...rest } = req.user!;
    if (req.user!.isNew) return res.redirect("/onboarding"); // redirects to the onboarding page for the user setup
    rest.profilePic =
      rest.profilePic || "/public/img/profile-pic-placeholder.jpg";
    return res.render("home", { subtitle: "Main", user: rest });
  }
}

export default new HomeController();

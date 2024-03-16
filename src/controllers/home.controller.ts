import { UserRequest } from "../types/express";
import { Response } from "express";

class HomeController {
    public getHomePage(req: UserRequest, res: Response) {
        const { password, ...rest } = req.user!;
        res.render("home", { title: "Home - Main", user: rest });
    }
}

export default new HomeController();

// this controller handles all events that involve Match, Chat and Message models

import { UserRequest } from "../types/global";
import { Response } from "express";

class MatchChatController {
  public async getMatchChatsPage(req: UserRequest, res: Response) {
    console.log(req);
    res.render("match-chats");
  }
}

export default new MatchChatController();

import { Router } from "express";

// using two controllers, one for handling likes and matches, another for handling matches with chats
import matchlikeController from "../controllers/matchlike.controller";
import matchChatController from "../controllers/matchchat.controller";

const matchRoutes = Router();

matchRoutes.get("/chats", matchChatController.getMatchChatsPage);
matchRoutes.post("/like", matchlikeController.handleMatchLikeFromCurrentUser);

export default matchRoutes;

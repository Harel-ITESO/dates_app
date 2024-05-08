import { Router } from "express";

// using two controllers, one for handling likes and matches, another for handling matches with chats
import matchController from "../controllers/match.controller";

const matchRoutes = Router();

matchRoutes.post("/like", matchController.handleMatchLikeFromCurrentUser);

matchRoutes.get("/chat/:id", matchController.getMatchChatPage);

export default matchRoutes;

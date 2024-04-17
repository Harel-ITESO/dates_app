// Handles redirection if the user is new
import { UserRequest } from "../types/global";
import { NextFunction, Response } from "express";

export default function newUserMiddleware(
  req: UserRequest,
  res: Response,
  next: NextFunction,
) {
  const { isNew } = req.user!;
  if (isNew) return res.redirect("/onboarding");
  next();
}

// Handles redirection if the user is new
import { NextFunction, Request, Response } from "express";

export default function newUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { isNew } = req.user!;
  if (isNew) return res.redirect("/onboarding");
  next();
}

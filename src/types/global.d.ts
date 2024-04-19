import { Request } from "express";
import { Interest, User } from "@prisma/client";

export interface UserRequest extends Request {
  user?: User;
}

interface InterestRelation extends Interest {
  selected: boolean;
}

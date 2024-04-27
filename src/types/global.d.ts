import { Request } from "express";
import { Prisma } from "@prisma/client";

export interface UserRequest extends Request {
  user?: Prisma.UserGetPayload<{
    include: {
      userInterests: true;
    };
  }>;
}

interface InterestRelation extends Interest {
  selected: boolean;
}

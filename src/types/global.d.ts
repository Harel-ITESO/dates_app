import { Request } from "express";
import { Prisma } from "@prisma/client";

export interface UserRequest extends Request {
  user?: Prisma.UserGetPayload<{
    include: {
      userInterests: true;
    };
  }>;
}

export interface SocketMessageRequest {
  message: string;
  matchId: number;
  sender: number;
}

interface InterestRelation extends Interest {
  selected: boolean;
}

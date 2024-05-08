import { Request } from "express";
import { User as PrismaUser, UserInterest } from "@prisma/client";

declare global {
  namespace Express {
    interface User extends PrismaUser {
      userInterests?: UserInterest[];
    }
  }
}
//
// export interface UserRequest extends Request {
//   user?: Prisma.UserGetPayload<{
//     include: {
//       userInterests: true;
//     };
//   }>;
// }

export interface SocketMessageRequest {
  message: string;
  matchId: number;
  sender: number;
}


/* Pool of various models to grab from using the same Prisma client instance */

import { PrismaClient } from "@prisma/client";
const model = new PrismaClient();

export const userModel = model.user;

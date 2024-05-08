/* Pool of various models to grab from using the same Prisma client instance */

import { PrismaClient } from "@prisma/client";
const model = new PrismaClient();

export const userModel = model.user;
export const interestModel = model.interest;
export const userInterestModel = model.userInterest;
export const likeModel = model.like;
export const matchModel = model.match;
export const chatModel = model.chat;
export const messageModel = model.message;

import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from "../utils/status-codes";

const prisma = new PrismaClient();

class PremiumMatchController {
    public async handleLikeDislike(req: Request, res: Response): Promise<void> {
        const toUserId = Number.parseInt(req.body.toUserId);
        const thisUserId = req.user!.userId;
        const isLike = req.body.isLike === "1" || req.body.isLike === 1;

    
        if (!toUserId) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "Other user ID must be provided" });
            return;
        }
    
        if (toUserId === thisUserId) {
            res.status(StatusCodes.BAD_REQUEST).send("Other user cannot be yourself");
            return;
        }
    
        try {
            let like = await prisma.like.findFirst({
                where: { fromUserId: thisUserId, toUserId: toUserId },
            });
    
            // Actualizar o crear el registro de like/dislike
            if (like) {
                like = await prisma.like.update({
                    where: { likeId: like.likeId },
                    data: { isLike },
                });
            } else {
                like = await prisma.like.create({
                    data: { fromUserId: thisUserId, toUserId: toUserId, isLike },
                });
            }
    
            // Comprobar si hay un match solo si es un like
            if (isLike) {
                const mutualLike = await prisma.like.findFirst({
                    where: {
                        fromUserId: toUserId,
                        toUserId: thisUserId,
                        isLike: true,
                    },
                });
    
                if (mutualLike) {
                    // Crear un match y el chat correspondiente
                    const match = await prisma.match.create({
                        data: {
                            firstUserId: thisUserId,
                            secondUserId: toUserId,
                            Chat: { create: {} },
                        },
                    });
                    res.json({
                        success: true,
                        message: "Match and chat created successfully!",
                        matchId: match.matchId,
                        matched: true,
                    });
                    return;
                }
            }
    
            res.status(StatusCodes.CREATED).json({
                success: true,
                message: like.isLike ? "Like registered successfully." : "Dislike registered successfully.",
                matched: false,
            });
        } catch (error) {
            console.error('Error processing like/dislike:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error processing like/dislike");
        }
    }
}

export default new PremiumMatchController();
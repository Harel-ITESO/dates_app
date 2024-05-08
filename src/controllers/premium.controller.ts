import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from '../utils/status-codes';

const prisma = new PrismaClient();

class PremiumController {
    public async getLikesToCurrentUser(req: Request, res: Response): Promise<void> {
        if (!req.user) {
            console.log("No user found in request");
            res.status(StatusCodes.UNAUTHORIZED).send("User not authenticated");
            return;
        }

        if (!req.user.hasSuscription) {
            res.redirect('/payment');
            return;
        }
        try {
            const respondedIds = await prisma.like.findMany({
                where: {
                    fromUserId: req.user.userId,
                },
                select: {
                    toUserId: true,
                }
            }).then(results => results.map(result => result.toUserId));

            // Consultar los usuarios que han dado "like" al usuario actual y que no han sido respondidos
            const usersWhoLiked = await prisma.like.findMany({
                where: {
                    toUserId: req.user.userId,
                    isLike: true,
                    fromUserId: {
                        notIn: respondedIds
                    }
                },
                include: {
                    fromUser: true
                }
            });

            const usersForView = usersWhoLiked.map(u => ({
                id: u.fromUser.userId,
                name: u.fromUser.username, 
                description: u.fromUser.description,
                profilePic: u.fromUser.profilePic || 'default-profile.png'
            }));

            res.render("premium", {
                title: "Usuarios que te han dado Like",
                users: usersForView
            });
        } catch (error) {
            console.error('Error fetching likes:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error fetching likes");
        }
    }
}

export default new PremiumController();
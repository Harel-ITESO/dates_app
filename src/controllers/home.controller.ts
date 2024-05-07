import {
  interestModel,
  likeModel,
  matchModel,
  userModel,
} from "../models/model-pool";
import { Request, Response } from "express";
import { StatusCodes } from "../utils/status-codes";

class HomeController {
  public async getHomePage(req: Request, res: Response) {
    const { password, ...user } = req.user!;
    // filter which users not to show if they were already liked/disliked
    const filteredUserIds = (
      await likeModel.findMany({
        select: {
          toUserId: true,
        },
        where: {
          fromUserId: user.userId,
        },
      })
    ).map((u) => u.toUserId);

    const otherUsers = await userModel.findMany({
      where: {
        userId: {
          not: user.userId,
          notIn: filteredUserIds,
        },
        isNew: false,
      },
    });

    res.render("home", {
      otherUsers,
      scripts: ["/public/js/home_main.js"],
      subtitle: "Home",
    });
  }

  public async getProfilePage(req: Request, res: Response) {
    const { password, userInterests, ...rest } = req.user!;
    const interestIds = userInterests!.map((ui) => ui.interestId);
    const allInterests = await interestModel.findMany();
    const userInterestsData = await interestModel.findMany({
      where: {
        interestId: { in: interestIds },
      },
    });

    res.render("home_profile", {
      user: rest,
      userInterests: userInterestsData,
      allInterests,
    });
  }
  public async getProfileById(req: Request, res: Response) {
    const loggedInUserId = req.user!.userId; // ID del usuario loggeado
    const requestedUserId = req.params.id; // ID del usuario solicitado en la URL
  
    // Si el ID solicitado es el mismo que el del usuario loggeado, redirecciona a su propio perfil
    if (loggedInUserId === parseInt(requestedUserId)) {
      return res.redirect("/profile");
    }    
  
    // Verificar si el usuario solicitado existe en la base de datos
    const requestedUser = await userModel.findUnique({
      where: {
        userId: parseInt(requestedUserId),
      },
    });
  
  
    // Si el usuario solicitado no existe, renderiza un error 404
    if (!requestedUser) {
      return res.status(StatusCodes.NOT_FOUND).send("Usuario no encontrado");
    }
  
    // Renderiza la información del usuario solicitado
    res.render("profile", {
      user: requestedUser,
      subtitle: "Perfil de Usuario",
    });
  }

  public async updateUserInterests(req: Request, res: Response) {
    const userId = req.user!.userId; // Obtener el ID de usuario actual
    const { interests } = req.body; // Obtener los intereses seleccionados del cuerpo de la solicitud

    try {
      // Actualizar los intereses del usuario en la base de datos
      await userModel.update({
        where: { userId },
        data: {
          // Actualizar los intereses del usuario con los nuevos intereses seleccionados
          // Este es solo un ejemplo, asegúrate de que el modelo y los campos coincidan con tu aplicación
          userInterests: interests, // Asigna los nuevos intereses al campo de intereses del usuario
        },
      });

      res.status(StatusCodes.OK).send("Intereses actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar intereses del usuario:", error);
      res.status(500).send("Error al actualizar intereses del usuario");

    }
  }

  

  public async getYourLikesPage(req: Request, res: Response) {
    const { password, ...rest } = req.user!;
    const opts = { user: rest.hasSuscription ? rest : null, subtitle: "Likes" };
    if (!rest.hasSuscription)
      return res
        .status(StatusCodes.FORBIDDEN)
        .render("forbidden_likespage", opts);
    // for the moment, this is the placeholder
    res.render("likespage", opts);
  }

  public async getMatchesPage(req: Request, res: Response) {
    const thisUser = req.user!;
    const userMatches = await matchModel.findMany({
      where: {
        OR: [
          {
            firstUserId: thisUser.userId,
          },
          {
            secondUserId: thisUser.userId,
          },
        ],
      },
      include: {
        secondUser: {
          select: {
            userId: true,
            profilePic: true,
            username: true,
          },
        },
        firstUser: {
          select: {
            userId: true,
            profilePic: true,
            username: true,
          },
        },
        Chat: {
          include: {
            messages: {
              select: {
                textContent: true,
                sendAt: true,
                senderId: true,
              },
              orderBy: {
                sendAt: "desc",
              },
            },
          },
        },
      },
    });

    const matches = userMatches.map((um) => {
      // find which user is not the current user
      const secondUser =
        thisUser.userId === um.firstUser.userId ? um.secondUser : um.firstUser;
      const currentChat = um.Chat[0];
      return {
        matchId: um.matchId,
        secondUserId: secondUser.userId,
        profilePic: secondUser.profilePic,
        username: secondUser.username,
        lastMessageTime: currentChat.messages[0]
          ? currentChat.messages[0].sendAt
          : "No tienes mensajes todavía",
      };
    });
    res.render("home_matches", {
      matches,
      subtitle: "Matches",
    });
  }

  public logout(_req: Request, res: Response) {
    res
      .clearCookie("authorization")
      .status(StatusCodes.ACCEPTED)
      .send("Logged out");
  }
}

export default new HomeController();

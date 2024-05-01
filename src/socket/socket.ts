// socket io functionalities
import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { SocketMessageRequest } from "../types/global";
import { matchModel, messageModel } from "../models/model-pool";

class SocketIO {
  private io: SocketServer;

  constructor(appServer: HttpServer) {
    this.io = new SocketServer(appServer);
  }

  // this is static for the moment, dependant of the app
  setSocketAppFunctionalities() {
    // auth user (Just ensure the cookie comes, the rest will be done by the app)
    this.io.use((socket, next) => {
      const hs = socket.handshake;
      const path = hs.headers.referer!.split("/")[1];
      if (path !== "login") {
        if (!hs.headers.cookie) next(new Error("Auth cookie not found"));
      }
      next();
    });

    this.io.on("connection", (socket) => {
      // when a new user is logged in

      // join the requesting user to the chat room
      socket.on("joinChat", async ([thisUserId, matchId]: number[]) => {
        const matchRoom = "match-" + matchId;
        socket.join(matchRoom);
        this.io.in(matchRoom).emit("otherUserConnection", thisUserId);
      });

      // on chat
      socket.on("newMessage", async (data: SocketMessageRequest) => {
        const { matchId, message, sender } = data;
        try {
          const match = await matchModel.findFirst({
            where: {
              matchId,
            },
            include: {
              Chat: {
                select: {
                  chatId: true,
                },
              },
            },
          });
          const reciever =
            match?.firstUserId === sender
              ? match.secondUserId
              : match?.firstUserId;

          const messageData = await messageModel.create({
            data: {
              sender: {
                connect: {
                  userId: sender,
                },
              },
              reciever: {
                connect: {
                  userId: reciever,
                },
              },
              textContent: message,
              chat: {
                connect: {
                  chatId: match?.Chat[0].chatId,
                },
              },
            },
          });
          this.io.in("match-" + matchId).emit("sendMessage", messageData);
        } catch (e: any) { }
      });
    });
  }
}

export default SocketIO;

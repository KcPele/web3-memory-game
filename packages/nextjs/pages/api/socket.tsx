import { NextRequest } from "next/server";
import { Server } from "socket.io";

interface IMessage {
  address: string;
  message: string;
}

export default function SocketHandler(req: NextRequest, res: any) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket: any) => {
    console.log("New connection", socket.id);
    socket.on("createdMessage", (msg: IMessage, gameId: string) => {
      console.log(msg);
      if (!gameId) {
        // socket.broadcast.emit("newIncomingMessage", msg);
      } else {
        socket.to(gameId).emit("newIncomingMessage", msg);
      }
    });
    socket.on("playerMove", (msg: IMessage, gameId: string) => {
      console.log("game play", msg, gameId);
      if (!gameId) {
        // socket.broadcast.emit("newIncomingMessage", msg);
      } else {
        socket.to(gameId).emit("newIncomingPlayerMove", msg);
      }
    });

    socket.on("joinGameRoom", (gameId: string) => {
      socket.join(gameId);
    });
  };

  // Define actions inside
  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
}

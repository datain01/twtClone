import { Server } from "socket.io";

export let io: Server;

export const initializeIo = (serverIo: Server) => {
  io = serverIo;
};

import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3001";

let socket: Socket;

export const useSocket = () => {
  if (!socket) {
    socket = io(URL);
  }

  return socket;
};

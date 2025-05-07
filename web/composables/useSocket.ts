import { io, Socket } from "socket.io-client";

const URL = "https://planning-poker-server-b7iw.onrender.com";

let socket: Socket;

export const useSocket = () => {
  if (!socket) {
    socket = io(URL);
  }

  return socket;
};

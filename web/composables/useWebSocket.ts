import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

// const url = "https://planning-poker-server-b7iw.onrender.com";
const url = "http://localhost:3001";

let socket: Socket;

export const useWebSocket = () => {
  if (!socket) {
    socket = io(url);
  }

  return socket;
};

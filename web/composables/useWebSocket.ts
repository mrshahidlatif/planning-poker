import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

const url =
  import.meta.env.VITE_WEB_SOCKET_SERVER_URL || "http://localhost:3001";

let socket: Socket;

export const useWebSocket = () => {
  if (!socket) {
    socket = io(url);
  }

  return socket;
};

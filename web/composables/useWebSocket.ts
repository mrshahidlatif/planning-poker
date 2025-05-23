import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

let socket: Socket;

export const useWebSocket = () => {
  if (!socket) {
    const config = useRuntimeConfig();

    if (!config.public.webSocketUrl) {
      throw new Error("NUXT_PUBLIC_WEB_SOCKET_URL is not set");
    }

    socket = io(config.public.webSocketUrl);
  }

  return socket;
};

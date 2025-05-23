import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

const config = useRuntimeConfig();

if (!config.public.webSocketUrl) {
  throw new Error("NUXT_PUBLIC_WEB_SOCKET_URL is not set");
}

const url = config.public.webSocketUrl;

let socket: Socket;

export const useWebSocket = () => {
  if (!socket) {
    socket = io(url);
  }

  return socket;
};

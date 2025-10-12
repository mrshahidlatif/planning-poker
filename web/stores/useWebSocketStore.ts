import { defineStore } from "pinia";
import { useWebSocket } from "~/composables/useWebSocket";

export const useWebSocketStore = defineStore("websocket", () => {
  const socket = useWebSocket();

  const isConnected = ref(false);
  const socketId = ref("");
  const error = ref<string | undefined>();

  const init = () => {
    socket.on("connect", () => {
      if (!socket.id) return;
      socketId.value = socket.id;
      isConnected.value = true;
      error.value = undefined;
    });

    socket.on("disconnect", () => {
      isConnected.value = false;
    });

    socket.on("connect_error", () => {
      error.value = "Failed to connect to server. Please try again later.";
    });

    socket.on("error", (error) => {
      error.value =
        error.message || "An error occurred while connecting to the room.";
    });
  };

  const clear = () => {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
    socket.off("error");
  };

  return {
    socket,
    isConnected,
    socketId,
    error,
    init,
    clear,
  };
});

import { defineStore } from "pinia";
import { useWebSocketStore } from "./useWebSocketStore";
import { useUserStore } from "./useUserStore";
import { useSession } from "~/composables/useSession";

export const useSessionStore = defineStore("session", () => {
  const websocketStore = useWebSocketStore();
  const { socket } = websocketStore;
  const userStore = useUserStore();
  const { saveSession, getSession, updateSession, isSessionValid } =
    useSession();

  const roomId = ref("");
  const isLoadingParticipants = ref(true);
  const error = ref<string | undefined>();

  const initialize = (newRoomId: string) => {
    roomId.value = newRoomId;
    error.value = undefined;
    isLoadingParticipants.value = true;

    // Check for existing session
    const session = getSession();
    if (session && session.roomId === newRoomId && isSessionValid()) {
      // Update user store with existing session info
      userStore.setUserInfo(session.userId, session.userName, false);
      // Join room with existing session
      joinRoom(session.userName);
    }
  };

  const createSession = (name: string) => {
    if (!name.trim()) return;

    isLoadingParticipants.value = true;
    error.value = undefined;

    // Get existing session or create new one
    const existingSession = getSession();

    if (existingSession && existingSession.roomId === roomId.value) {
      // Update existing session with new name
      updateSession({ userName: name });
      // Update user store with existing session info
      userStore.setUserInfo(existingSession.userId, name, false);
    } else {
      // Create new session
      const newUserId = crypto.randomUUID();
      const newAdminId = crypto.randomUUID();

      saveSession({
        roomId: roomId.value,
        userId: newUserId,
        userName: name,
        adminId: newAdminId,
      });
      // Update user store with new session info
      userStore.setUserInfo(newUserId, name, false);
    }

    joinRoom(name);
  };

  const joinRoom = (userName: string) => {
    const session = getSession();
    if (!session || !roomId.value) return;

    socket.emit("join-room", {
      userId: session.userId,
      userName,
      roomId: roomId.value,
    });
  };

  const handleRoomState = (data: any) => {
    error.value = undefined;
    isLoadingParticipants.value = false;
  };

  const handleError = (errorData: any) => {
    error.value =
      errorData.message || "An error occurred while connecting to the room.";
    isLoadingParticipants.value = false;
  };

  const clearError = () => {
    error.value = undefined;
  };

  const destroy = () => {
    roomId.value = "";
    isLoadingParticipants.value = true;
    error.value = undefined;
  };

  return {
    roomId,
    isLoadingParticipants,
    error,
    initialize,
    createSession,
    joinRoom,
    handleRoomState,
    handleError,
    clearError,
    destroy,
  };
});

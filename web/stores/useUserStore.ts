import { defineStore } from "pinia";
import { useSession } from "~/composables/useSession";
import type { User } from "~/types";

export const useUserStore = defineStore("user", () => {
  const { getSession } = useSession();

  const userId = ref("");
  const userName = ref("");
  const isAdmin = ref(false);
  const nameSubmitted = ref(false);
  const users = ref<Record<string, User>>({});
  const notification = ref<string | null>(null);

  const initialize = () => {
    const session = getSession();
    if (session) {
      userId.value = session.userId;
      userName.value = session.userName;
      nameSubmitted.value = !!session.userName;
    }
  };

  const setUserInfo = (id: string, name: string, admin: boolean) => {
    userId.value = id;
    userName.value = name;
    isAdmin.value = admin;
    nameSubmitted.value = true;
  };

  const updateUserName = (name: string) => {
    userName.value = name;
  };

  const handleRoomState = (data: any) => {
    const wasAdmin = isAdmin.value;
    users.value = data.users;
    isAdmin.value = data.adminUserId === userId.value;

    // Show notification if admin status changed
    if (wasAdmin && wasAdmin !== isAdmin.value) {
      if (isAdmin.value) {
        notification.value = "You are now the admin!";
      } else {
        notification.value = "Admin privileges transferred to another user.";
      }

      // Clear notification after 3 seconds
      setTimeout(() => {
        notification.value = null;
      }, 3000);
    }
  };

  const updateUserVote = (userId: string, vote: any) => {
    if (users.value[userId]) {
      users.value[userId] = {
        ...users.value[userId],
        vote: vote,
      };
    }
  };

  const reset = () => {
    userId.value = "";
    userName.value = "";
    isAdmin.value = false;
    nameSubmitted.value = false;
    users.value = {};
    notification.value = null;
  };

  return {
    userId,
    userName,
    isAdmin,
    nameSubmitted,
    users,
    notification,
    initialize,
    setUserInfo,
    updateUserName,
    handleRoomState,
    updateUserVote,
    reset,
  };
});

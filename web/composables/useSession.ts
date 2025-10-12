import { useSessionStorage } from "./useSessionStorage";

export type SessionState = {
  roomId: string;
  userId: string;
  userName: string;
  adminId: string;
};

const SESSION_KEY = "session";

export const useSession = () => {
  const { setItem, getItem, removeItem } = useSessionStorage();

  const saveSession = (data: SessionState) => {
    setItem(SESSION_KEY, data);
  };

  const getSession = (): SessionState | null => {
    return getItem<SessionState>(SESSION_KEY);
  };

  const updateSession = (updates: Partial<SessionState>) => {
    const current = getSession();
    if (current) {
      saveSession({ ...current, ...updates });
    }
  };

  const clearSession = () => {
    removeItem(SESSION_KEY);
  };

  const isSessionValid = (): boolean => {
    const session = getSession();
    return !!(session?.roomId && session?.userId && session?.userName);
  };

  return {
    saveSession,
    getSession,
    updateSession,
    clearSession,
    isSessionValid,
  };
};

export const useSessionStorage = () => {
  const setItem = (key: string, value: any) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to sessionStorage:", error);
    }
  };

  const getItem = <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error("Error reading from sessionStorage:", error);
      return defaultValue || null;
    }
  };

  const removeItem = (key: string) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from sessionStorage:", error);
    }
  };

  const clear = () => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
    }
  };

  return {
    setItem,
    getItem,
    removeItem,
    clear,
  };
};

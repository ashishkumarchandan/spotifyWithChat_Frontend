// ✅ FILE: src/hooks/useInitAuth.ts
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

export function useInitAuth() {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const init = async () => {
      try {
        const token = await getToken();
        if (token) {
          await checkAdminStatus();
          if (userId) initSocket(userId);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      api.interceptors.request.eject(interceptor);
      disconnectSocket();
    };
  }, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

  return loading;
}

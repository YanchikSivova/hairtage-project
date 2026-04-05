import { useState, useEffect, useCallback } from "react";
import { authApi } from "../api/hairtageApi";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchAdminStatus = useCallback(async () => {
    try {
      const adminStatus = await authApi.isAdmin();
      const adminValue =
        typeof adminStatus === "boolean"
          ? adminStatus
          : Boolean(adminStatus?.isAdmin ?? adminStatus?.admin ?? adminStatus);

      setIsAdmin(adminValue);
      return adminValue;
    } catch {
      setIsAdmin(false);
      return false;
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
      return userData;
    } catch (err) {
      setUser(null);
      setError(err?.response?.data?.message || "Ошибка получения данных пользователя");
      return null;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const authStatus = await authApi.checkAuth();
      const isAuthorized = Boolean(authStatus?.authenticated);

      setIsAuth(isAuthorized);

      if (isAuthorized) {
        await Promise.all([fetchUserData(), fetchAdminStatus()]);
      } else {
        setUser(null);
        setIsAdmin(false);
      }

      return isAuthorized;
    } catch (err) {
      if (err.response?.status === 401) {
        setIsAuth(false);
        setIsAdmin(false);
        setUser(null);
      } else {
        setError(err?.message || "Ошибка проверки авторизации");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUserData, fetchAdminStatus]);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setInitialized(true);
    };

    initAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      await authApi.login(email, password);

      const isAuthenticated = await checkAuth();

      if (isAuthenticated) {
        const adminValue = await fetchAdminStatus();
        return { success: true, isAdmin: adminValue };
      }

      return { success: false, isAdmin: false };
    } catch (err) {
      setError(err?.response?.data?.message || "Ошибка входа");
      setIsAuth(false);
      setIsAdmin(false);
      setUser(null);
      return { success: false, isAdmin: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
      setIsAuth(false);
      setIsAdmin(false);
      setUser(null);
    } catch {
      setError("Ошибка при выходе");
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuth,
    isAdmin,
    error,
    loading,
    initialized,
    login,
    logout,
    checkAuth,
    fetchUserData,
  };
};
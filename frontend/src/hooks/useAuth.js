import { useState, useEffect, useCallback } from "react";
import { authApi } from "../api/hairtageApi";
import { useLocation } from "react-router-dom";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const location = useLocation();

    const fetchAdminStatus = useCallback(async () => {
        try {
            const adminStatus = await authApi.isAdmin();
            const adminValue =
                typeof adminStatus === 'boolean'
                    ? adminStatus
                    : Boolean(adminStatus?.isAdmin ?? adminStatus?.admin ?? adminStatus);

            setIsAdmin(adminValue);
            return adminValue;
        } catch {
            setIsAdmin(false);
            return false;
        }
    }, []);

    const checkAuth = useCallback(async () => {
        const publicPaths = ['/login', '/register'];
        if (publicPaths.includes(location.pathname)) {
            setIsAuth(false);
            setIsAdmin(false);
            setLoading(false);
            return false;
        }

        setError(null);
        setLoading(true);

        try {
            const authStatus = await authApi.checkAuth();
            const isAuthorized = Boolean(authStatus?.authenticated);

            setIsAuth(isAuthorized);

            if (isAuthorized) {
                await fetchAdminStatus();
            } else {
                setIsAdmin(false);
            }

            return isAuthorized;
        } catch (err) {
            if (err.response?.status === 401) {
                setIsAuth(false);
                setIsAdmin(false);
            } else {
                setError(err?.message || 'Ошибка проверки авторизации');
            }
            return false;
        } finally {
            setLoading(false);
        }
    }, [location.pathname, fetchAdminStatus]);

    const fetchUserData = useCallback(async () => {
        setLoading(true);
        try {
            const userData = await authApi.getMe();
            setUser(userData);
            return userData;
        } catch (err) {
            setError(err?.response?.data?.message || 'Ошибка получения данных пользователя');
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            try {
                const authStatus = await authApi.checkAuth();
                const isAuthorized = Boolean(authStatus?.authenticated);

                setIsAuth(isAuthorized);

                if (isAuthorized) {
                    await Promise.all([
                        fetchUserData(),
                        fetchAdminStatus(),
                    ]);
                } else {
                    setUser(null);
                    setIsAdmin(false);
                }
            } catch {
                setIsAuth(false);
                setIsAdmin(false);
                setUser(null);
            } finally {
                setInitialized(true);
                setLoading(false);
            }
        };

        initAuth();
    }, [fetchUserData, fetchAdminStatus]);

    const login = async (email, password) => {
        setError(null);
        setLoading(true);

        try {
            await authApi.login(email, password);

            const isAuthenticated = await checkAuth();

            if (isAuthenticated) {
                await fetchUserData();
                const adminValue = await fetchAdminStatus();
                return { success: true, isAdmin: adminValue };
            }

            return { success: false, isAdmin: false };
        } catch (err) {
            setError(err?.response?.data?.message || 'Ошибка входа');
            setIsAuth(false);
            setIsAdmin(false);
            setUser(null);
            return { success: false, isAdmin: false };
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setLoading(true);
        setError(null);

        try {
            await authApi.register(email, username, password);

            const isAuthenticated = await checkAuth();

            if (isAuthenticated) {
                await fetchUserData();
                const adminValue = await fetchAdminStatus();
                return { success: true, isAdmin: adminValue };
            }

            return { success: false, isAdmin: false };
        } catch (err) {
            setError(err?.response?.data?.message || 'Ошибка регистрации');
            return { success: false, isAdmin: false };
        } finally {
            setLoading(false);
        }
    };

    const settings = async (username, email, password) => {
        setLoading(true);
        setError(null);

        try {
            await authApi.settings(username, email, password);
            await checkAuth();
            await fetchUserData();
            return true;
        } catch (err) {
            setError(err?.response?.data?.message || 'Ошибка смены данных аккаунта');
            return false;
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
            setError('Ошибка при выходе');
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
        register,
        logout,
        settings,
        checkAuth,
        fetchUserData,
    };
};
import { useState, useEffect, useCallback } from "react";
import { api } from "../api/apiClient";
import { authApi } from "../api/hairtageApi";
import { useLocation } from "react-router-dom";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const checkAuth = useCallback(async () => {

        const publicPaths = ['/login', '/register'];
        if (publicPaths.includes(location.pathname)) {
            setIsAuth(false);
            setLoading(false);
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const authStatus = await authApi.checkAuth();
            setIsAuth(authStatus)
            return authStatus
        } catch (err) {
            if (err.response?.status === 401) { //401 (Unauthorized){
                setIsAuth(false);
            } else {
                setError(err.message || 'Ошибка проверки авторизации');
            }
            return false;
        } finally {
            setLoading(false);
        }
    }, [location.pathname]);

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
            const isAuthenticated = await checkAuth();
            if (isAuthenticated) {
                await fetchUserData();
            }
        };
        initAuth();
    }, [checkAuth, fetchUserData]);

    const login = async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            await authApi.login(email, password)
            const isAuthenticated = await checkAuth();
            if (isAuthenticated) {
                await fetchUserData();
            }
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка входа');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setLoading(true);
        setError(null);
        try {
            await authApi.register(username, email, password)
            const isAuthenticated = await checkAuth();
            if (isAuthenticated) {
                await fetchUserData();
            }
            return true;
        } catch (err) {
            setError(err?.response?.data?.message || 'Ошибка регистрации');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const settings = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            await api.put('/auth/settings', { name, email, password });
            await checkAuth();
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
            setUser(null);
        } catch (err) {
            setError('Ошибка при выходе');
        } finally {
            setLoading(false);
        }
    };

    return { user, isAuth, error, loading, login, register, logout, settings, checkAuth, fetchUserData};
}
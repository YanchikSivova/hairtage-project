import { useState, useEffect, useCallback } from "react";
import { api } from "../api/apiClient";
import { useLocation } from "react-router-dom";

export const useAuth = () =>{
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const checkAuth = useCallback(async () =>{

        const publicPaths = ['/login', '/register'];
        if (publicPaths.includes(location.pathname)){
            setLoading(false);
            return;
        }
        setError(null);
        setLoading(true);
        try{
            const response = await api.get('auth/me')
            setUser(response.data.user);
        } catch(err){
            if (err.response?.status === 401){ //401 (Unauthorized){
                setUser(null);
            }else{
                setError(err.message || 'Ошибка проверки авторизации');
            }
        }finally{
            setLoading(false);
        }
    }, [location.pathname]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email, password) =>{
        setError(null);
        setLoading(true);
        try{
            await api.post('/auth/login', {email, password});
            await checkAuth();
            return true;
        }catch(err){
            setError(err.response?.data?.message || 'Ошибка входа');
            return false;
        }finally{
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try{
            await api.post('/auth/register', {name, email, password});
            await checkAuth();
            return true;
        }catch(err){
            setError(err?.response?.data?.message || 'Ошибка регистрации');
            return false;
        }finally{
            setLoading(false);
        }
    };

    const settings = async(name, email, password) =>{
        setLoading(true);
        setError(null);
        try{
            await api.put('/auth/settings', {name, email, password});
            await checkAuth();
            return true;
        }catch(err){
            setError(err?.response?.data?.message || 'Ошибка смены данных аккаунта');
            return false;
        }finally{
            setLoading(false);
        }
    };

    const logout = async () =>{
        setLoading(true);
        try{
            await api.post('/auth/logout');
            setUser(null);
        }catch(err){
            setError('Ошибка при выходе');
        }finally{
            setLoading(false);
        }
    };

    return {user, error, loading, login, register, logout, settings, checkAuth };
}
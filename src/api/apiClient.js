import axios from "axios";

const baseApi = axios.create({
    baseURL: 'http://localhost:3000/hairtage',
    withCredentials: true,
    timeout: 5000,
});

export const api = axios.create({
    ...baseApi.defaults,
    headers:{
        'Content-Type': 'application/json',
    },
});

export const formApi = axios.create({
    ...baseApi.defaults,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});

formApi.interceptors.request.use(config => {
    if (config.data && typeof config.data === 'object') {
        const params = new URLSearchParams();
        Object.keys(config.data).forEach(key => {
            params.append(key, config.data[key]);
        });
        config.data = params;
    }
    return config;
});
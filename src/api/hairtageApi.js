import { formApi, api } from "./apiClient";

export async function postSurvey(answers){
    const response = await api.post('/selection', answers);
    return response.data;
}

export async function getSurveys(){
    const response = await api.get('/surveys');
    return response.data;
}

export const authApi = {
    login: (email, password) => formApi.post('/auth/login', {email, password}),
    register: (name, email, password) => formApi.post('/auth/register', {name, email, password}),
    logout: ()=>formApi.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    settings: () => api.put('/auth/settings'),
};
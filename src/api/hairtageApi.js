import { formApi, api } from "./apiClient";

// Отправляет опрос неавторизованного пользователя, получает продукты
export async function postSurvey(answers){
    const response = await api.post('/selection', answers);
    return response.data;
}

// Отправляет опрос авторизованного пользователя для добавления в бд
export async function postAuthSurveys(answers){
    const response = await formApi.post('/selection', answers);
    return response.data;
}

export async function getSurveys(){
    const response = await formApi.get('/surveys');
    return response.data;
}

//Получает результаты последнего опроса авторизованного пользователя
export async function getResults(){
    const response = await formApi.get('/results');
    return response.data;
}

export async function postResults(){
    const response = await api.post('/results', answers);
    return response.data;
}

export const authApi = {
    login: (email, password) => formApi.post('/auth/login', {email, password}),
    register: (name, email, password) => formApi.post('/auth/register', {name, email, password}),
    logout: ()=>formApi.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    settings: () => api.put('/auth/settings'),
};
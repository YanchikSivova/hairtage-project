import { api } from "./apiClient";

// Отправляет опрос, получает продукты
export async function postSurvey(answers) {
    const response = await api.post('/person/selection', answers);
    return response.data;
}

//Получает результаты последнего опроса авторизованного пользователя
export async function getResults() {
    const response = await api.get('person/selection/auth');
    return response.data;
}


//Отправляет тип волос, возвращает список продуктов
export async function getResultsByHairtype(hairtypeId){
    const response = await api.get(`/person/selection/${hairtypeId}`)
    return response.data;
}

export const authApi = {

//вход в аккаунт
    login: (email, password) =>
        api.post('/login',
            { email, password },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        ).then(res => res.data),

//регистрация
    register: (email, username, password) =>
        api.post('/person/registration',
            { email, username, password }
        ).then(res => res.data),

//выход из аккаунта
    logout: () => api.post('/logout').then(res => res.data),

//данные аккаунта пользователя
    getMe: () => api.get('/person/accountInfo').then(res => res.data),

//Проверяет авторизован ли пользователь
    checkAuth: () => api.get('/person/checkAuth').then(res => res.data),

    settings: (username, email) => api.patch('/person/update', {username, email}).then(res => res.data),  //
};
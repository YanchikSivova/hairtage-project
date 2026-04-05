import { api } from './apiClient'

// Отправляет опрос, получает продукты
export async function postSurvey(answers) {
  const response = await api.post('/person/selection', answers)
  return response.data
}

// Получает результаты последнего опроса авторизованного пользователя
export async function getResults() {
  const response = await api.get('/person/selection/auth')
  return response.data
}

// Отправляет тип волос, возвращает список продуктов из истории
export async function getResultsByHairtype(hairtypeId) {
  const response = await api.get(`/person/selection/${hairtypeId}`)
  return response.data
}

export const authApi = {
  login: (email, password) =>
    api
      .post(
        '/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((res) => res.data),

  register: (name, email, password) =>
    api
      .post('/person/registration', {
        username: name,
        email,
        password,
      })
      .then((res) => res.data),

  logout: () =>
    api
      .post('/logout', null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((res) => res.data),

  getMe: () => api.get('/person/accountInfo').then((res) => res.data),

  checkAuth: () =>
    api
      .get('/person/accountInfo')
      .then((res) => ({ authenticated: true, user: res.data }))
      .catch(() => ({ authenticated: false })),

  settings: (name, email, password) =>
    api
      .post('/person/update', {
        username: name,
        email,
        password,
      })
      .then((res) => res.data),
}

export const adminApi = {
  getProducts: () => api.get('/admin').then((res) => res.data),

  createProduct: (data) =>
    api.post('/admin/create', data).then((res) => res.data),

  updateProduct: (productId, data) =>
    api.patch(`/admin/update/${productId}`, data).then((res) => res.data),

  deleteProduct: (productId) =>
    api.delete(`/admin/delete/${productId}`).then((res) => res.data),

  addRole: (email) =>
    api.patch(`/admin/addRole/${email}`).then((res) => res.data),
}
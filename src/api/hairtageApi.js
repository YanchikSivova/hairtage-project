import { formApi, api } from './apiClient'

// Опрос
export async function postSurvey(answers) {
  const response = await api.post('/person/selection', answers)
  return response.data
}

export async function postAuthSurveys(answers) {
  const response = await api.post('/person/selection', answers)
  return response.data
}

// Временно для старого SurveyHistory.jsx
export async function getSurveys() {
  const response = await api.get('/person/accountInfo')
  return response.data?.history ?? []
}

// Текущая подборка авторизованного пользователя
export async function getResults() {
  const response = await api.get('/person/selection/auth')
  return response.data
}

// Временно для старого useResults.js:
// неавторизованный пользователь получает результаты по локально сохранённым ответам
export async function postResults(answers) {
  const parsedAnswers =
    typeof answers === 'string' ? answers.split(',').map((x) => Number(x)) : answers

  const response = await api.post('/person/selection', parsedAnswers)
  return response.data
}

// Подборка по записи из истории
export async function getSelectionByHairTypeId(hairTypeId) {
  const response = await api.get(`/person/selection/${hairTypeId}`)
  return response.data
}

// Информация аккаунта
export async function getAccountInfo() {
  const response = await api.get('/person/accountInfo')
  return response.data
}

export const adminApi = {
  getProducts: async () => {
    const response = await api.get('/admin')
    return response.data
  },

  createProduct: async (productData) => {
    const response = await api.post('/admin/create', productData)
    return response.data
  },

  updateProduct: async (id, productData) => {
    const response = await api.patch(`/admin/update/${id}`, productData)
    return response.data
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/delete/${id}`)
    return response.data
  },

  addProductsBulk: async (products) => {
    const response = await api.post('/product/addProducts', products)
    return response.data
  },

  addAdminRole: async (email) => {
    const response = await api.patch(`/admin/addRole/${email}`)
    return response.data
  },
}
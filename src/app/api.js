import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const TOKEN_KEY = 'attendance_token'

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

api.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError = !error.response && (error.code === 'ERR_NETWORK' || /network/i.test(error.message || ''))

    const message = isNetworkError
      ? `Unable to connect to the backend server. Please start the API server and verify ${baseURL}.`
      : error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Something went wrong.'

    if (error.response?.status === 401) {
      setAuthToken(null)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    const normalized = new Error(message)
    normalized.status = error.response?.status
    normalized.payload = error.response?.data
    return Promise.reject(normalized)
  },
)

export const getErrorMessage = (error) => {
  if (!error) return 'Something went wrong.'

  if (!error.response && (error.code === 'ERR_NETWORK' || /network/i.test(error.message || ''))) {
    return `Unable to connect to the backend server. Please start the API server and verify ${baseURL}.`
  }

  return error.response?.data?.message || error.message || 'Something went wrong.'
}

export default api

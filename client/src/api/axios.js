import axios from 'axios'
import { store } from '../store/store'
import { logout } from '../store/slices/authSlice'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach JWT
api.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle Auth Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout())
    }
    return Promise.reject(error)
  }
)

export default api

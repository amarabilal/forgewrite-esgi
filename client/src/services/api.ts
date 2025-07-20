import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import router from '@/router'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default api

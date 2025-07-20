// src/store/authStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import router from '@/router'

interface User {
  id: number
  email: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const login = async (credentials: { email: string; password: string; token2FA?: string }) => {
    try {
      const res = await api.post('/auth/login', credentials)
      setToken(res.data.accessToken)
      user.value = {
        id: res.data.userId,
        email: res.data.email,
        role: res.data.role
      }
      return { success: true }
    } catch (err: any) {
      if (err.response?.status === 401 && err.response.data.message === '2FA token is required.') {
        throw { is2FARequired: true }
      }
      throw err
    }
  }

  const setToken = (newToken: string | null) => {
    token.value = newToken
    if (newToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.warn('Logout failed', err)
    }
    token.value = null
    user.value = null
    router.push('/login')
  }

  const refresh = async () => {
    try {
      const res = await api.post('/auth/refresh')
      setToken(res.data.accessToken)
      return true
    } catch (err) {
      setToken(null)
      return false
    }
  }

  const fetchMe = async () => {
    if (!token.value) return
    try {
      const res = await api.get('/users/me')
      user.value = res.data
    } catch {
      user.value = null
    }
  }

  return {
    user,
    token,
    login,
    logout,
    refresh,
    fetchMe,
    setToken
  }
}, {
  persist: true
})

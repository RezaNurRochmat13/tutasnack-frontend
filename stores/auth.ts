import type { User } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  function setSession(u: User, t: string) {
    user.value = u
    token.value = t
    if (import.meta.client) {
      localStorage.setItem('auth_token', t)
      localStorage.setItem('auth_user', JSON.stringify(u))
    }
  }

  function loadSession() {
    if (import.meta.client) {
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('auth_user')
      if (savedToken && savedUser) {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      }
    }
  }

  function logout() {
    user.value = null
    token.value = null
    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }

  return { user, token, loading, isAuthenticated, setSession, loadSession, logout }
})

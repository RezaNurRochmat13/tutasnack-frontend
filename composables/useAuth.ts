import type { AuthPayload } from '~/types/auth'

export function useAuth() {
  const { request } = useApi()
  const store = useAuthStore()

  async function login(payload: AuthPayload) {
    store.loading = true
    try {
      const res: any = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: payload.email, password: payload.password }),
      })
      const data = res.data || res
      store.setSession(data.user, data.token)
      await navigateTo('/dashboard')
    } finally {
      store.loading = false
    }
  }

  async function register(payload: AuthPayload) {
    store.loading = true
    try {
      const res: any = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: payload.email, password: payload.password, name: payload.name }),
      })
      const data = res.data || res
      store.setSession(data.user, data.token)
      await navigateTo('/dashboard')
    } finally {
      store.loading = false
    }
  }

  function logout() {
    store.logout()
    navigateTo('/login')
  }

  return { login, register, logout }
}

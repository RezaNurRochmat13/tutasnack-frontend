export function useApi() {
  const config = useRuntimeConfig()
  const BASE_URL = config.public.apiBaseUrl

  function getHeaders(extra?: Record<string, string>) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...extra,
    }
    if (import.meta.client) {
      const token = localStorage.getItem('auth_token')
      if (token) headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: getHeaders(options?.headers as Record<string, string> | undefined),
      ...options,
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: 'Request failed' }))
      const error = new Error('Request failed') as any
      error.status = res.status
      error.body = body
      throw error
    }

    return res.json()
  }

  return { request }
}

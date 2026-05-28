export function useApi() {
  const config = useRuntimeConfig()
  const BASE_URL = config.public.apiBaseUrl

  async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(err.message || err.error || `HTTP ${res.status}`)
    }

    return res.json()
  }

  return { request }
}

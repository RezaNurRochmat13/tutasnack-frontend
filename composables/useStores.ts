import type { Store } from '~/types/store'

export function useStores() {
  const { request } = useApi()

  async function list(): Promise<Store[]> {
    const res: any = await request('/stores', { method: 'GET' })
    if (res.data && Array.isArray(res.data)) return res.data as Store[]
    if (Array.isArray(res)) return res as Store[]
    return []
  }

  return { list }
}

import type { Store, StorePayload } from '~/types/store'

export function useStores() {
  const { request } = useApi()

  async function list(): Promise<Store[]> {
    const res: any = await request('/stores', { method: 'GET' })
    if (res.data && Array.isArray(res.data)) return res.data as Store[]
    if (Array.isArray(res)) return res as Store[]
    return []
  }

  async function create(payload: StorePayload): Promise<Store> {
    const res: any = await request('/stores', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return res.data || res
  }

  async function update(id: string, payload: StorePayload): Promise<Store> {
    const res: any = await request(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    return res.data || res
  }

  async function remove(id: string): Promise<void> {
    await request(`/stores/${id}`, { method: 'DELETE' })
  }

  return { list, create, update, remove }
}

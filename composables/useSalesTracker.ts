import type { SalesTracker, SalesTrackerPayload } from '~/types/sales-tracker'

export function useSalesTracker() {
  const { request } = useApi()

  async function list(): Promise<SalesTracker[]> {
    const res: any = await request('/sales-tracker', { method: 'GET' })
    if (res.data && Array.isArray(res.data)) return res.data as SalesTracker[]
    if (Array.isArray(res)) return res as SalesTracker[]
    return []
  }

  async function create(payload: SalesTrackerPayload): Promise<SalesTracker> {
    const res: any = await request('/sales-tracker', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return res.data || res
  }

  async function update(id: string, payload: SalesTrackerPayload): Promise<SalesTracker> {
    const res: any = await request(`/sales-tracker/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    return res.data || res
  }

  async function remove(id: string): Promise<void> {
    await request(`/sales-tracker/${id}`, { method: 'DELETE' })
  }

  return { list, create, update, remove }
}

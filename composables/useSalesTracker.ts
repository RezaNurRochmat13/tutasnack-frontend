import type { SalesTracker, SalesTrackerPayload } from '~/types/sales-tracker'
import type { PaginationMeta } from '~/types/pagination'

export function useSalesTracker() {
  const { request } = useApi()

  async function list(page = 1, limit = 10, storeId?: string): Promise<{ data: SalesTracker[]; pagination: PaginationMeta | null }> {
    let url = `/sales-tracker?page=${page}&limit=${limit}`
    if (storeId) url += `&storeId=${storeId}`
    const res: any = await request(url, { method: 'GET' })
    return {
      data: (res.data || res || []) as SalesTracker[],
      pagination: res.pagination ?? null,
    }
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

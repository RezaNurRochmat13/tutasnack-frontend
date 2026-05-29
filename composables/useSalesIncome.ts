import type { SalesIncome, SalesIncomePayload } from '~/types/sales-income'
import type { PaginationMeta } from '~/types/pagination'

export function useSalesIncome() {
  const { request } = useApi()

  async function list(page = 1, limit = 10, storeId?: string): Promise<{ data: SalesIncome[]; pagination: PaginationMeta | null }> {
    let url = `/sales-income?page=${page}&limit=${limit}`
    if (storeId) url += `&storeId=${storeId}`
    const res: any = await request(url, { method: 'GET' })
    return {
      data: (res.data || res || []) as SalesIncome[],
      pagination: res.pagination ?? null,
    }
  }

  async function create(payload: SalesIncomePayload): Promise<SalesIncome> {
    const res: any = await request('/sales-income', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return res.data || res
  }

  async function update(id: string, payload: SalesIncomePayload): Promise<SalesIncome> {
    const res: any = await request(`/sales-income/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    return res.data || res
  }

  async function remove(id: string): Promise<void> {
    await request(`/sales-income/${id}`, { method: 'DELETE' })
  }

  return { list, create, update, remove }
}

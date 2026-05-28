import type { SalesIncome, SalesIncomePayload } from '~/types/sales-income'

export function useSalesIncome() {
  const { request } = useApi()

  async function list(): Promise<SalesIncome[]> {
    const res: any = await request('/sales-income', { method: 'GET' })
    if (res.data && Array.isArray(res.data)) return res.data as SalesIncome[]
    if (Array.isArray(res)) return res as SalesIncome[]
    return []
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

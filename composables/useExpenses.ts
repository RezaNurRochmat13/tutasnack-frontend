import type { Expense, ExpensePayload } from '~/types/expense'

export function useExpenses() {
  const { request } = useApi()

  async function list(): Promise<Expense[]> {
    const res: any = await request('/expenses', { method: 'GET' })
    if (res.data && Array.isArray(res.data)) return res.data as Expense[]
    if (Array.isArray(res)) return res as Expense[]
    return []
  }

  async function create(payload: ExpensePayload): Promise<Expense> {
    const res: any = await request('/expenses', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return res.data || res
  }

  async function update(id: string, payload: ExpensePayload): Promise<Expense> {
    const res: any = await request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    return res.data || res
  }

  async function remove(id: string): Promise<void> {
    await request(`/expenses/${id}`, { method: 'DELETE' })
  }

  return { list, create, update, remove }
}

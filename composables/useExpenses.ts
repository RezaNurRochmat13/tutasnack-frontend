import type { Expense, ExpensePayload } from '~/types/expense'
import type { PaginationMeta } from '~/types/pagination'

export function useExpenses() {
  const { request } = useApi()

  async function list(page = 1, limit = 10): Promise<{ data: Expense[]; pagination: PaginationMeta | null }> {
    const res: any = await request(`/expenses?page=${page}&limit=${limit}`, { method: 'GET' })
    return {
      data: (res.data || res || []) as Expense[],
      pagination: res.pagination ?? null,
    }
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

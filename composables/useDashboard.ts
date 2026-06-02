interface SalesTrackerStoreRecap {
  storeId: string
  storeName: string
  totalSaleCount: number
  totalSoldCount: number
}

interface MonthlyRecap {
  year: number
  month: string
  total: number
}

export function useDashboard() {
  const { request } = useApi()

  async function totalExpense(): Promise<number> {
    const res: any = await request('/dashboard/total-expense', { method: 'GET' })
    return res.data?.total ?? res.total ?? 0
  }

  async function totalRevenue(): Promise<{ gross: number; net: number }> {
    const res: any = await request('/dashboard/total-revenue', { method: 'GET' })
    const rd = res.data || res
    return { gross: rd.gross ?? 0, net: rd.net ?? 0 }
  }

  async function monthlyRecap(year: number): Promise<MonthlyRecap[]> {
    const res: any = await request(`/dashboard/monthly-recap?year=${year}`, { method: 'GET' })
    return (res.data || res || []) as MonthlyRecap[]
  }

  async function yearlyRecap(year: number) {
    const res: any = await request(`/dashboard/yearly-recap?year=${year}`, { method: 'GET' })
    return (res.data || res || []) as { month: string; total: number }[]
  }

  async function salesTrackerByStore(storeId?: string) {
    const params = storeId ? `?storeId=${storeId}` : ''
    const res: any = await request(`/dashboard/sales-tracker${params}`, { method: 'GET' })
    return (res.data || res || []) as SalesTrackerStoreRecap[]
  }

  return { totalExpense, totalRevenue, monthlyRecap, yearlyRecap, salesTrackerByStore }
}

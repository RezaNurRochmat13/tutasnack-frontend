export interface SalesIncomeStore {
  id: string
  name: string
  description: string | null
  address: string | null
}

export interface SalesIncome {
  id: string
  storeId: string
  salesDate: string
  amount: number
  createdAt: string
  updatedAt: string
  store: SalesIncomeStore
}

export interface SalesIncomePayload {
  salesDate: string
  amount: number
  storeId: string
}

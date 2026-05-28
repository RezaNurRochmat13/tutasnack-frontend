export interface Expense {
  id: string
  name: string
  expenseDate: string
  amount: number
  createdAt: string
  updatedAt: string
}

export interface ExpensePayload {
  name: string
  expenseDate: string
  amount: number
}

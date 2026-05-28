export interface SalesTracker {
  id: string
  storeId: string
  salesDate: string
  saleCount: number
  soldCount: number
  createdAt: string
  updatedAt: string
  store?: {
    id: string
    name: string
  }
}

export interface SalesTrackerPayload {
  salesDate: string
  saleCount: number
  soldCount: number
  storeId: string
}

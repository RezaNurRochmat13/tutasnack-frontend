export interface Store {
  id: string
  name: string
  description: string | null
  address: string | null
  createdAt: string
  updatedAt: string
}

export interface StorePayload {
  name: string
  description?: string
  address?: string
}

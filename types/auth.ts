export interface User {
  id: number
  name: string
  email: string
  role?: string
}

export interface AuthPayload {
  email: string
  password: string
  name?: string
}

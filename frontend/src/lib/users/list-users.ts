import { api } from '@/lib/api'

export type User = {
  id: string
  username: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export const listUsers = async () => {
  const { data } = await api.get('/v1/users')
  return data
}

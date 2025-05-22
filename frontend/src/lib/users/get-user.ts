import { api } from '@/lib/api'
import { User } from '@/lib/users/list-users'

export const getUser = async (id: string): Promise<User> => {
  const { data } = await api.get(`/v1/users/${id}`)
  return data
}

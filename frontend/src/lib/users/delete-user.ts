import { api } from '../api'

export const deleteUser = async (id: string) => {
  return await api.delete(`/v1/users/${id}`)
}

import { api } from '@/lib/api'

export type CreateUserInputDto = {
  username: string
  name: string
  email: string
}

export const createUser = (data: CreateUserInputDto) => {
  return api.post('/v1/users', data)
}

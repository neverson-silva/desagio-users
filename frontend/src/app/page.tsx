'use client'
import { useState } from 'react'
import { useQuery, useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { createUser } from '@/lib/users/create-user'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { listUsers, User } from '@/lib/users/list-users'
import { getQueryClient } from '@/app/get-query-client'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { deleteUser } from '@/lib/users/delete-user'
import { getUser } from '@/lib/users/get-user'
const formSchema = z.object({
  firstName: z.string().min(3, {
    message: 'Informe um nome com no minimo 3 caracteres',
  }),
  lastName: z.string().min(3, {
    message: 'Informe um sobrenome com no minimo 3 caracteres',
  }),
  username: z
    .string()
    .min(3, {
      message: 'Informe um usuário com no minimo 3 caracteres',
    })
    .max(30, 'Informe um usuário com no maximo 30 caracteres'),
  email: z.string().email('Email invalido'),
})
export default function Home() {
  const queryClient = getQueryClient()

  const { data: usersList = [] } = useSuspenseQuery<User[]>({
    queryKey: ['usersList'],
    queryFn: listUsers,
  })

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const { data: user } = useQuery<User>({
    queryKey: ['user', selectedUserId],
    queryFn: () => getUser(selectedUserId!),
    enabled: !!selectedUserId, // Só carrega quando tem ID selecionado
  })

  const handleViewUser = (id: string) => {
    setSelectedUserId(id)
  }

  const handleCloseDialog = () => {
    setSelectedUserId(null)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
    },
  })
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('Usuário criado com sucesso')
      form.reset()
      queryClient.invalidateQueries({
        queryKey: ['usersList'],
      })
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const mutationUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('Usuário deletado com sucessp')
      form.reset()
      queryClient.invalidateQueries({
        queryKey: ['usersList'],
      })
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params: {
      username: string
      name: string
      email: string
    } = {
      username: values.username,
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
    }
    mutation.mutate(params)
  }

  return (
    <div className=" h-full bg-background flex flex-col gap-8 justify-center content-center items-center  font-[family-name:var(--font-geist-sans)]">
      <Card className="min-w-2xl p-5">
        <CardTitle className="text-xl">Novo Usuario</CardTitle>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Joao" className="h-12" {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobrenome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Silva"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="joao.silva"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          size={4}
                          placeholder="joao@email.com"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                size="lg"
                type="submit"
                className="cursor-pointer"
                onClick={form.handleSubmit(onSubmit)}
              >
                Salvar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="min-w-2xl p-5">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Nome</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Data de criacao</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersList.map((user) => (
                <TableRow key={user?.id}>
                  <TableCell>{user?.name}</TableCell>
                  <TableCell>{user?.username}</TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell className="text-right">
                    {user?.createdAt
                      ? new Date(user?.createdAt).toLocaleDateString()
                      : ''}
                  </TableCell>
                  <TableCell className="text-right gap-2 flex">
                    <Button
                      size="sm"
                      variant={'destructive'}
                      onClick={() => {
                        mutationUserMutation.mutate(user.id)
                      }}
                    >
                      <Trash2 />
                    </Button>
                    <Button
                      size="sm"
                      variant={'outline'}
                      onClick={() => {
                        queryClient.setQueryData(
                          ['usersList'],
                          usersList.filter((item) => item.id !== user.id),
                        )
                      }}
                    >
                      <Pencil />
                    </Button>

                    <Button
                      size="sm"
                      variant={'default'}
                      onClick={() => {
                        handleViewUser(user.id)
                      }}
                    >
                      <Eye />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {user && (
        <Dialog open={!!selectedUserId} onOpenChange={handleCloseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Usuário</DialogTitle>
              <DialogDescription>
                <div className="space-y-4">
                  <p>Nome: {user.name}</p>
                  <p>Username: {user.username}</p>
                  <p>Email: {user.email}</p>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

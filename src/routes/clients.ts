import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import z from 'zod'
import { AuthTokenVerify } from "../utils/authTokenVerify";

export default async function Clients (app: FastifyInstance) {
  app.get('/clients', async () => {
    const clients = await prisma.clients.findMany({
      orderBy: {
        index: 'asc'
      }
    })

    return clients
  })

  app.post('/add-client', async (request, reply) => {
    const bodySchema = z.object({
      image: z.string(),
      name: z.string(),
      index: z.number()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { image, name, index } = bodySchema.parse(request.body)

    const client = await prisma.clients.create({
      data: {
        image,
        name,
        index
      }
    })

    return client || []
  })

  app.get('/find-client/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const clients = await prisma.clients.findFirstOrThrow({
      where: {
        id
      }
    })

    return clients
  })

  app.put('/edit-client/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const bodySchema = z.object({
      image: z.string(),
      name: z.string(),
      index: z.number()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const { image, name, index } = bodySchema.parse(request.body)

    const allClients = await prisma.clients.findMany({
      orderBy: {
        index: 'asc'
      }
    })

    async function reorderList(
      list: {
        id: string,
        image: string,
        index?: number | null,
        name: string
      }[],
      fromIndex: number,
      toIndex: number
    ) {

      // Verifica se os índices são válidos
      if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex > list.length) {
        console.error("Índices fora do intervalo da lista");
        return list;
      }

      const [ removed ] = list.splice(fromIndex, 1)
      list.splice(toIndex, 0, removed)

      list.forEach((obj, ind) => {
        obj.index = ind
      })

      await prisma.clients.deleteMany()

      await prisma.clients.createMany({
        data: list
      })
    }

    const fromIndex = allClients.findIndex((e) => e.id === id)

    await reorderList(allClients, fromIndex, index)

    const clients = await prisma.clients.update({
      where: {
        id
      },
      data: {
        name,
        image
      }
    })

    return clients
  })

  app.delete('/remove-client/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const clients = await prisma.clients.delete({
      where: {
        id
      }
    })

    const allClients = await prisma.clients.findMany()

    async function reorderItens(
      list: {
        id: string,
        image: string,
        index?: number | null,
        name: string
      }[],
    ) {

      list.forEach(async (obj, ind) => {
        obj.index = ind

        await prisma.clients.update({
          where: {
            id: obj.id
          },
          data: {
            ...obj,
            index: ind
          }
        })
      })
    }

    await reorderItens(allClients)

    return clients
  })


  app.delete('/remove-all-clients', async (request, reply) => {
    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const clients = prisma.clients.deleteMany()
      .then(() => {
        return 'Todos os fornecedores foram removidos'
      })
      .catch(() => {
        return 'Erro ao deletar os fornecedores'
      })

    return clients
  })
}
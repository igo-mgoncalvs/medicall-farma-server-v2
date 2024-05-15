import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import z from 'zod'
import { AuthTokenVerify } from "../utils/authTokenVerify";

export default async function Clients (app: FastifyInstance) {
  app.get('/clients', async () => {
    const clients = await prisma.clients.findMany()

    return clients
  })

  app.post('/add-client', async (request, reply) => {
    const bodySchema = z.object({
      image: z.string(),
      name: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { image, name } = bodySchema.parse(request.body)

    const client = await prisma.clients.create({
      data: {
        image,
        name
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
      name: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const { image, name } = bodySchema.parse(request.body)

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

    const clients = prisma.clients.delete({
      where: {
        id
      }
    })

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
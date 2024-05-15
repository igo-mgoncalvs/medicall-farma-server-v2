import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import z from 'zod'
import { AuthTokenVerify } from "../utils/authTokenVerify"

export default async function Groups(app: FastifyInstance) {
  app.get('/groups', async () => {
    const productsGroups = await prisma.productsGroups.findMany()

    return productsGroups
  })

  app.post('/add-group', async (request, reply) => {
    const bodySchema = z.object({
      group_name: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { group_name } = bodySchema.parse(request.body)
    
    const group = prisma.productsGroups.create({
      data: {
        group_name
      }
    })

    return group
  })

  app.get('/find-group/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)
    
    const group = prisma.productsGroups.findUniqueOrThrow({
      where: {
        id
      }
    })

    return group
  })

  app.put('/edit-group/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const bodySchema = z.object({
      group_name: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const { group_name } = bodySchema.parse(request.body)
    
    const group = prisma.productsGroups.update({
      where: {
        id
      },
      data: {
        group_name
      }
    })

    return group
  })

  app.delete('/remove-group/:id', async (request, reply) => {
    const bodySchema = z.object({
      id: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = bodySchema.parse(request.params)

    const product = prisma.productsGroups.delete({
      where: {
        id
      }
    })

    return product
  })

  app.delete('/remove-all-groups', async (request, reply) => {
    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }
    
    const product = prisma.productsGroups.deleteMany()
      .then(() => {
        return 'Todos os grupos foram removidos'
      })
      .catch(() => {
        return 'Erro ao deletar os grupos'
      })

    return product
  })
}
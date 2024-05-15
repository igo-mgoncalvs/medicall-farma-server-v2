import { FastifyInstance } from "fastify";
import { getAuth } from 'firebase-admin/auth'
import z from "zod";
import { prisma } from "../lib/prisma";

export default async function Users (app: FastifyInstance) {
  app.get('/users', async () => {
    const users = await prisma.users.findMany()

    return users
  })

  app.post('/new-user', async (request) => {
    const bodySchema = z.object({
      email: z.string(),
      password: z.string(),
      userName: z.string()
    })

    const { email, password, userName } = bodySchema.parse(request.body)

    const userCreated = await getAuth()
      .createUser({
        email,
        password,
        displayName: userName,
        emailVerified: false,
      })

    await getAuth()
      .generateEmailVerificationLink(email)

    const user = await prisma.users.create({
      data: {
        id: userCreated.uid,
        email,
        userName,
      }
    })
    
    return user
  })

  app.put('/edit-user/:id', async (request) => {
    const bodySchema = z.object({
      email: z.string().optional(),
      password: z.string().optional(),
      userName: z.string().optional()
    })

    const paramsSchema = z.object({
      id: z.string()
    })

    const { id } = paramsSchema.parse(request.params)

    const { email, password, userName } = bodySchema.parse(request.body)

    const editUser = await getAuth()
      .updateUser(id, {
        email,
        password,
        displayName: userName
      })
    
    const user = await prisma.users.update({
      where: {
        id
      },
      data: {
        email,
        userName,
        id: editUser.uid
      }
    })

    return user
  })

  app.get('/find-user/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const { id } = paramsSchema.parse(request.params)

    const user = await prisma.users.findUnique({
      where: {
        id
      }
    })

    return user
  })

  app.delete('/delete-user/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const { id } = paramsSchema.parse(request.params)

    await getAuth()
      .deleteUser(id)

    const user = await prisma.users.delete({
      where: {
        id
      }
    })

    return user
  })
}
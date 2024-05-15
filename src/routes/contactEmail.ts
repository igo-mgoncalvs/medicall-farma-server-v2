import { FastifyInstance } from "fastify";
import { z } from "zod";
import { AuthTokenVerify } from "../utils/authTokenVerify";
import { prisma } from "../lib/prisma";

export default async function ContactEmail(app: FastifyInstance) {

  app.get('/contact-email', async () => {
    const email = await prisma.contactEmail.findFirstOrThrow()

    return email
  })

  app.post('/contact-email', async (request, reply) => {
    const bodySchema = z.object({
      email: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { email } = bodySchema.parse(request.body)

    const addEmail = await prisma.contactEmail.create({
      data: {
        email
      }
    })

    return addEmail
  })

  app.put('/edit-contact-email', async (request, reply) => {
    const bodySchema = z.object({
      email: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { email } = bodySchema.parse(request.body)

    const findEmail = await prisma.contactEmail.findFirstOrThrow()

    const addEmail = await prisma.contactEmail.update({
      where: {
        id: findEmail.id
      },
      data: {
        email
      }
    })

    return addEmail
  })

  app.delete('/remove-contact-email/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const { id } = paramsSchema.parse(request.params)

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const addEmail = await prisma.contactEmail.delete({
      where: {
        id: id
      }
    })

    return addEmail
  })
}
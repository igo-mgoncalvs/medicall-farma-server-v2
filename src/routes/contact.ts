import { FastifyInstance } from "fastify";
import z from 'zod'

import { prisma } from "../lib/prisma";
import { AuthTokenVerify } from '../utils/authTokenVerify'

export default async function Contact(app: FastifyInstance) {
  app.get('/contact-link', async () => {
    const contact = await prisma.contact.findFirstOrThrow()
    
    return {
      link: contact.link
    }
  })
  
  app.post('/add-contact-link', async (request, reply) => {
    const bodySchema = z.object({
      link: z.string()
    })
    
    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { link } = bodySchema.parse(request.body)

    const linkCreate = await prisma.contact.create({
      data: {
        link
      }
    })

    return linkCreate
  })

  app.put('/edit-contact-link', async (request, reply) => {
    const bodySchema = z.object({
      link: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const contactId = await prisma.contact.findFirstOrThrow()

    const { link } = bodySchema.parse(request.body)

    const editLink = prisma.contact.update({
      where: {
        id: contactId.id
      },
      data: {
        link
      }
    })

    return editLink
  })
}
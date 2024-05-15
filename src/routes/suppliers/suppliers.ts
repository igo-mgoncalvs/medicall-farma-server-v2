import { FastifyInstance } from "fastify";
import z from 'zod'

import { prisma } from "../../lib/prisma";
import { AuthTokenVerify } from '../../utils/authTokenVerify'

export default async function SuppliersScreen (app: FastifyInstance) {
  app.get('/suppliers-screen', async () => {
    const suppliers = await prisma.suppliersScreen.findFirstOrThrow()

    return suppliers
  })

  app.post('/add-suppliers-screen', async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      text: z.string(),
      secound_title: z.string(),
      image: z.string(),
      imageId: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { image, imageId, text, title, secound_title } = bodySchema.parse(request.body)

    const suppliers = await prisma.suppliersScreen.create({
      data: {
        image, 
        imageId,
        text, 
        title,
        secound_title
      }
    })

    return suppliers
  })

  app.put('/edit-suppliers-screen', async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      text: z.string(),
      secound_title: z.string(),
      image: z.string(),
      imageId: z.string(),
      enable: z.boolean()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const suppliersId = await prisma.suppliersScreen.findFirstOrThrow()

    const { image, imageId, text, title, secound_title, enable } = bodySchema.parse(request.body)

    const suppliers = await prisma.suppliersScreen.update({
      where: {
        id: suppliersId.id
      },
      data: {
        image, 
        imageId,
        text, 
        title,
        secound_title,
        enable
      }
    })

    return suppliers
  })
}
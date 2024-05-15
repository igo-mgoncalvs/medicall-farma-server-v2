import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { AuthTokenVerify } from '../../utils/authTokenVerify'
import z from 'zod'
import { randomUUID } from "crypto";

export default async function AboutUsDirectors (app: FastifyInstance) {
  app.get('/about-us-directors', async () => {
    const directors = await prisma.aboutUsDirectors.findMany()

    return directors || []
  })

  app.post('/about-us-add-directors', async (request, reply) => {
    const bodySchema = z.object({
      image: z.string(),
      imageId: z.string(),
      title: z.string(),
      text: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { image, imageId, text, title } = bodySchema.parse(request.body)

    let aboutUsId: string

    const findAboutUs = await prisma.aboutUs.findFirst()

    if(findAboutUs !== null) {
      aboutUsId = findAboutUs.id
    } else {
      const createAboutUs = await prisma.aboutUs.create({
        data: {
          id: randomUUID()
        }
      })

      aboutUsId = createAboutUs.id
    }

    const directors = await prisma.aboutUsDirectors.create({
      data: {
        image, 
        imageId,
        text, 
        title,
        aboutUsId
      }
    })

    return directors
  })

  app.put('/about-us-edit-directors/:id', async (request, reply) => {
    const bodySchema = z.object({
      image: z.string(),
      imageId: z.string(),
      title: z.string(),
      text: z.string()
    })

    const paramsSchema = z.object({
      id: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const { image, imageId, text, title } = bodySchema.parse(request.body)

    const directors = await prisma.aboutUsDirectors.update({
      where: {
        id
      },
      data: {
        image, 
        imageId,
        text, 
        title
      }
    })

    return directors
  })

  app.delete('/about-us-delete-directors/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const directors = await prisma.aboutUsDirectors.delete({
      where: {
        id
      }
    })

    return directors
  })
}
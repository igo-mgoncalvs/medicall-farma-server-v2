import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from 'zod'
import { randomUUID } from "crypto";
import { AuthTokenVerify } from "../../utils/authTokenVerify";

export default async function AboutUsValues (app: FastifyInstance) {
  app.get('/about-us-values', async () => {
    const values = await prisma.aboutUsValues.findMany({
      orderBy: {
        index: "asc"
      }
    })

    return values || []
  })

  app.post('/about-us-add-value', async (request, reply) => {
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
    
    const value = await prisma.aboutUsValues.create({
      data: {
        image, 
        imageId,
        text, 
        title,
        aboutUsId
      }
    })
    
    return value
  })

  app.put('/about-us-edit-value/:id', async (request, reply) => {
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

    const value = await prisma.aboutUsValues.update({
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

    return value
  })

  app.put('/reorder-values', async (request, reply) => {
    const bodySchema = z.object({
      id: z.string(),
      index: z.number()
    }).array()

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const productsList = bodySchema.parse(request.body)

    return productsList.forEach(async (item) => {
      return await prisma.aboutUsValues.update({
        where: {
          id: item.id
        },
        data: {
          index: item.index
        }
      })
    })

  })

  app.delete('/about-us-delete-value/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const value = await prisma.aboutUsValues.delete({
      where: {
        id
      }
    })

    return value
  })
}
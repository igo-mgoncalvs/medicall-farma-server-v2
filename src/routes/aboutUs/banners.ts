import { FastifyInstance } from "fastify";
import z from 'zod'
import { prisma } from "../../lib/prisma";
import { bucket } from "../..";
import { randomUUID } from "crypto";
import { AuthTokenVerify } from "../../utils/authTokenVerify";

export default async function AboutUsBanners(app: FastifyInstance) {
  app.get('/about-us-banners', async () => {
    const banners = await prisma.aboutUsBanners.findMany()

    return banners
  })

  app.post('/add-about-us-banners', async (request, reply) => {
    const bodySchema = z.object({
      image: z.string(),
      imageId: z.string(),
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }
    
    const {image, imageId} = bodySchema.parse(request.body)

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

    const banner = await prisma.aboutUsBanners.create({
      data: {
        image,
        imageId,
        aboutUsId
      }
    })

    return banner
  })

  app.put('/about-us-update-banners', async (request, reply) => {
    const bodySchema = z.object({
      image: z.string(),
      imageId: z.string()
    }).array()

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }
    
    const schema = bodySchema.parse(request.body)

    await prisma.aboutUsBanners.deleteMany()
    
    const banner = await prisma.aboutUsBanners.createMany({
      data: schema
    })

    return banner
  })

  app.post('/about-us-delete-banner/:imageId', async (request, reply) => {
    const paramsSchema = z.object({
      imageId: z.string(),
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }
    
    const { imageId  } = paramsSchema.parse(request.params)

    await prisma.aboutUsBanners.delete({
      where: {
        imageId
      }
    })

    return await bucket.file(imageId).delete()
    .then(() => ({
      data: 'Imagem deletada com sucesso!'
    }))
  })

  app.delete('/about-us-delete-all-banners', async (request, reply) => {
    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }
    
    const banner = await prisma.aboutUsBanners.deleteMany()

    return banner
  })
}
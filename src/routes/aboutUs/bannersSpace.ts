import { FastifyInstance } from "fastify";
import z from 'zod'
import { prisma } from "../../lib/prisma";
import { bucket } from "../..";
import { randomUUID } from "crypto";
import { AuthTokenVerify } from "../../utils/authTokenVerify";

export default async function AboutUsSpaceBanners(app: FastifyInstance) {
  app.get('/about-us-space-banners', async () => {
    const banners = await prisma.aboutUsSpaceimages.findMany()

    return banners
  })

  app.post('/add-about-us-space-banners', async (request, reply) => {
    const bodySchema = z.object({
      image: z.string(),
      imageId: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { image, imageId } = bodySchema.parse(request.body)

    let aboutUsSpaceId: string

    const findAboutUsSpace = await prisma.aboutUsSpace.findFirst()

    if(findAboutUsSpace !== null) {
      aboutUsSpaceId = findAboutUsSpace.id
    } else {
      const createAboutUsSpace = await prisma.aboutUsSpace.create({
        data: {
          id: randomUUID()
        }
      })

      aboutUsSpaceId = createAboutUsSpace.id
    }

    const banner = await prisma.aboutUsSpaceimages.createMany({
      data: {
        image,
        imageId,
        aboutUsSpaceId
      }
    })

    return banner
  })

  app.put('/about-us-update-space-banners', async (request, reply) => {
    const bodySchema = z.object({
      image: z.string(),
      imageId: z.string()
    }).array()

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const schema = bodySchema.parse(request.body)

    await prisma.aboutUsSpaceimages.deleteMany()
    
    const banner = await prisma.aboutUsSpaceimages.createMany({
      data: schema
    })

    return banner
  })

  app.post('/about-us-delete-space-banner/:imageId', async (request, reply) => {
    const paramsSchema = z.object({
      imageId: z.string(),
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { imageId  } = paramsSchema.parse(request.params)

    await prisma.aboutUsSpaceimages.delete({
      where: {
        imageId
      }
    })

    return await bucket.file(imageId).delete()
    .then(() => ({
      data: 'Imagem deletada com sucesso!'
    }))
  })

  app.delete('/about-us-delete-all-space-banners', async (request, reply) => {
    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const banner = await prisma.aboutUsSpaceimages.deleteMany()

    return banner
  })
}
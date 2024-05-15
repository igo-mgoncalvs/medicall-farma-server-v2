import { FastifyInstance } from "fastify";
import z from 'zod'
import { prisma } from "../../lib/prisma";
import { AuthTokenVerify } from "../../utils/authTokenVerify";

export default async function HomeCatalog(app: FastifyInstance) {
  app.get('/find-home-catalog', async () => {
    return await prisma.catalogMain.findFirstOrThrow()
  })

  app.post(`/add-home-catalog`, async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      text: z.string(),
      button_text: z.string(),
      button_link: z.string(),
      image: z.string(),
      imageId: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { button_link, button_text, image, text, title, imageId } = bodySchema.parse(request.body)

    const catalog = await prisma.catalogMain.create({
      data: {
        button_link,
        button_text,
        image,
        text,
        title,
        imageId
      }
    })

    const findHome = await prisma.home.findFirst()

    if(findHome?.id) {
      await prisma.home.update({
        where: {
          id: findHome.id
        },
        data: {
          catalogMainId: catalog.id
        }
      })
    } else {
      await prisma.home.create({
        data: {
          homeMainId: catalog.id
        }
      })
    }

    return catalog
  })

  app.put(`/edit-home-catalog`, async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      text: z.string(),
      button_text: z.string(),
      button_link: z.string(),
      image: z.string(),
      enable: z.boolean()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { button_link, button_text, image, text, title, enable } = bodySchema.parse(request.body)

    const catalogFind = await prisma.catalogMain.findFirst()

    const catalog = await prisma.catalogMain.update({
      where: {
        id: catalogFind?.id
      },
      data: {
        button_link,
        button_text,
        image,
        text,
        title,
        enable
      }
    })

    const findHome = await prisma.home.findFirst()

    if(findHome?.id) {
      await prisma.home.update({
        where: {
          id: findHome.id
        },
        data: {
          catalogMainId: catalog.id
        }
      })
    } else {
      await prisma.home.create({
        data: {
          catalogMainId: catalog.id
        }
      })
    }

    return catalog
  })
}
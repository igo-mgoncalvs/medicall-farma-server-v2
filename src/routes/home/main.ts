import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from 'zod'
import { AuthTokenVerify } from "../../utils/authTokenVerify";

export default async function HomeMain(app: FastifyInstance) {
  app.get('/find-home-main', async () => {
    return await prisma.homeMain.findFirstOrThrow()
  })

  app.post(`/add-home-main`, async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      text: z.string(),
      button_text: z.string(),
      button_link: z.string(),
      image: z.string(),
      imageId: z.string(),
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { title, text, button_link, button_text, image, imageId } = bodySchema.parse(request.body)

    const main = await prisma.homeMain.create({
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
          homeMainId: main.id
        }
      })
    } else {
      await prisma.home.create({
        data: {
          homeMainId: main.id
        }
      })
    }

    return main
  })
  app.put(`/edit-home-main`, async (request, reply) => {
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

    const { title, text, button_link, button_text, image, enable } = bodySchema.parse(request.body)

    const mainFind = await prisma.homeMain.findFirst()

    const main = prisma.homeMain.update({
      where: {
        id: mainFind?.id
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

    return main
  })
}
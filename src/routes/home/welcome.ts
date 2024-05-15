import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from 'zod'
import { AuthTokenVerify } from "../../utils/authTokenVerify";

export default async function HomeWelcome (app:  FastifyInstance) {
  app.get('/find-home-welcome', async () => {
    return await prisma.welcomeMain.findFirstOrThrow()
  })

  app.post(`/add-home-welcome`, async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      title_color: z.string(),
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

    const { button_link, button_text, image, text, title, title_color, imageId } = bodySchema.parse(request.body)

    const welcome = await prisma.welcomeMain.create({
      data: {
        button_link,
        button_text,
        image,
        text,
        title,
        title_color,
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
          welcomeMainId: welcome.id
        }
      })
    } else {
      await prisma.home.create({
        data: {
          welcomeMainId: welcome.id
        }
      })
    }

    return welcome
  })

  app.put(`/edit-home-welcome`, async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      title_color: z.string(),
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

    const { button_link, button_text, image, text, title, title_color, enable } = bodySchema.parse(request.body)

    const mainFind = await prisma.welcomeMain.findFirst()

    const welcome = prisma.welcomeMain.update({
      where: {
        id: mainFind?.id
      },
      data: {
        button_link,
        button_text,
        image,
        text,
        title,
        title_color,
        enable
      }
    })

    return welcome
  })
}
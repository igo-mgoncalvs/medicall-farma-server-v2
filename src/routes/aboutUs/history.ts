import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from 'zod'
import { AuthTokenVerify } from "../../utils/authTokenVerify";

export default async function AboutUsHistory (app: FastifyInstance) {
  app.get('/about-us-history', async () => {
    const history = await prisma.aboutUsHistory.findFirstOrThrow()

    return history
  })

  app.post('/add-about-us-history', async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      text: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { text, title } = bodySchema.parse(request.body)

    const history = await prisma.aboutUsHistory.create({
      data: {
        text,
        title
      }
    })

    const findScreen = await prisma.aboutUs.findFirst()

    if(findScreen !== null) {
      await prisma.aboutUs.update({
        where: {
          id: findScreen.id
        },
        data: {
          aboutUsHistoryId: history.id
        }
      })
    } else {
      await prisma.aboutUs.create({
        data: {
          aboutUsHistoryId: history.id
        }
      })
    }

    return history
  })

  app.put('/edit-about-us-history', async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      text: z.string(),
      enable: z.boolean()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { text, title, enable } = bodySchema.parse(request.body)

    const historyId = await prisma.aboutUsHistory.findFirstOrThrow()

    const history = await prisma.aboutUsHistory.update({
      where: {
        id: historyId.id
      },
      data: {
        text,
        title,
        enable
      }
    })

    return history
  })
}
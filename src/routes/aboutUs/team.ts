import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from 'zod'
import { AuthTokenVerify } from "../../utils/authTokenVerify";

export default async function AboutUsTeam (app: FastifyInstance) {
  app.get('/about-us-team', async () => {
    const team = await prisma.aboutUsTeam.findFirstOrThrow()

    return team
  })

  app.post('/add-about-us-team', async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      text: z.string(),
      image: z.string(),
      imageId: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { text, title, image, imageId } = bodySchema.parse(request.body)

    const team = await prisma.aboutUsTeam.create({
      data: {
        text,
        title,
        image,
        imageId
      }
    })

    const findScreen = await prisma.aboutUs.findFirst()

    if(findScreen !== null) {
      await prisma.aboutUs.update({
        where: {
          id: findScreen.id
        },
        data: {
          aboutUsTeamId: team.id
        }
      })
    } else {
      await prisma.aboutUs.create({
        data: {
          aboutUsTeamId: team.id
        }
      })
    }

    return team
  })

  app.put('/edit-about-us-team', async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      text: z.string(),
      image: z.string(),
      imageId: z.string(),
      enable: z.boolean()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { text, title, image, imageId, enable } = bodySchema.parse(request.body)

    const teamId = await prisma.aboutUsTeam.findFirstOrThrow()

    const team = await prisma.aboutUsTeam.update({
      where: {
        id: teamId.id
      },
      data: {
        text,
        title,
        image, 
        imageId,
        enable
      }
    })

    return team
  })
}
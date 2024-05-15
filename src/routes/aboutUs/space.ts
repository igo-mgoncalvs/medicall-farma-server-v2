import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from 'zod'
import { AuthTokenVerify } from "../../utils/authTokenVerify";

export default async function AboutUsSpace (app: FastifyInstance) {
  app.get('/about-us-space', async () => {
    const space = await prisma.aboutUsSpace.findFirstOrThrow({
      include: {
        images: true
      }
    })

    return space
  })

  app.post('/add-about-us-space', async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      text: z.string(),
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { text, title } = bodySchema.parse(request.body)

    const findSpaceScreen = await prisma.aboutUsSpace.findFirst()

    let space

    if(findSpaceScreen === null) {
      const spaceCreate = await prisma.aboutUsSpace.create({
        data: {
          text,
          title
        }
      })

      space = spaceCreate
    } else {
      const spaceEdit = await prisma.aboutUsSpace.update({
        where: {
          id: findSpaceScreen?.id
        },
        data: {
          text,
          title
        }
      })

      space = spaceEdit
    }


    const findScreen = await prisma.aboutUs.findFirst()

    if(findScreen !== null) {
      await prisma.aboutUs.update({
        where: {
          id: findScreen.id
        },
        data: {
          aboutUsSpaceId: space.id
        }
      })
    } else {
      await prisma.aboutUs.create({
        data: {
          aboutUsSpaceId: space.id
        }
      })
    }

    return space
  })

  app.put('/edit-about-us-space', async (request, reply) => {
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

    const spaceId = await prisma.aboutUsSpace.findFirstOrThrow()
    
    const space = await prisma.aboutUsSpace.update({
      where: {
        id: spaceId.id
      },
      data: {
        text,
        title,
        enable
      }
    })

    return space
  })
}
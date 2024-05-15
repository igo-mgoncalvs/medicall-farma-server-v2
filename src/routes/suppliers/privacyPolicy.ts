import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from 'zod'
import { AuthTokenVerify } from "../../utils/authTokenVerify";

export default async function PrivacyPolicy(app: FastifyInstance) {
  app.get('/privacy-policy', async () => {
    const policy = await prisma.privacyPolicy.findFirstOrThrow()

    return policy
  })

  app.post('/add-privacy-policy',async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      text: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { text, title } = bodySchema.parse(request.body)

    const privacy = await prisma.privacyPolicy.create({
      data: {
        text,
        title
      }
    })

    return privacy
  })

  app.put('/edit-privacy-policy',async (request, reply) => {
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

    const findPrivacy = await prisma.privacyPolicy.findFirstOrThrow()

    const privacy = await prisma.privacyPolicy.update({
      where: {
        id: findPrivacy.id
      },
      data: {
        text,
        title,
        enable
      }
    })

    return privacy
  })
}
import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { AuthTokenVerify } from "../utils/authTokenVerify";
import { getStorage } from "firebase-admin/storage";

export default async function Logos(app: FastifyInstance) {
  const bucket = getStorage().bucket('gs://medicall-farma.appspot.com');

  app.get('/logos', async () => {
    const logos = await prisma.logos.findFirstOrThrow() 

    return logos
  })  

  app.post('/add-logos', async (request, reply) => {
    const bodySchema = z.object({
      logoColorId: z.string(),
      logoColor: z.string(),
      logoWhiteId: z.string(),
      logoWhite: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { logoColor, logoColorId, logoWhite, logoWhiteId } = bodySchema.parse(request.body)

    const logos = await prisma.logos.create({
      data: {
        logoColor,
        logoColorId,
        logoWhite,
        logoWhiteId
      }
    }) 

    return logos
  })

  app.post('/edit-logos', async (request, reply) => {
    const bodySchema = z.object({
      logoColorId: z.string(),
      logoColor: z.string(),
      logoWhiteId: z.string(),
      logoWhite: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { logoColor, logoColorId, logoWhite, logoWhiteId } = bodySchema.parse(request.body)

    const logoId = await prisma.logos.findFirstOrThrow()

    const logos = await prisma.logos.update({
      where: {
        id: logoId.id
      },
      data: {
        logoColor,
        logoColorId,
        logoWhite,
        logoWhiteId
      }
    }) 

    return logos
  })

  app.delete('/remove-all-logos', async (request, reply) => {
    const logos = await prisma.logos.findMany()

    reply.status(404).send({
      statusCode: 404,
      message: 'Nenhuma imagem encontrada'
    })

    logos.forEach(async (logo) => {
      return await Promise.all([
        bucket.file(logo.logoWhiteId).delete(),
        bucket.file(logo.logoColorId).delete()
      ])
        .then(async () => {
          const deleteLogo = await prisma.logos.delete({
            where: {
              id: logo.id
            }
          })
          
          return deleteLogo
        })
        .catch(() => {
          reply.status(500).send({
            statusCode: 500,
            message: 'Erro ao deletar os logos'
          })
        })
    })
  })
}
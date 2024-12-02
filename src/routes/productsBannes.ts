import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { AuthTokenVerify } from "../utils/authTokenVerify";
import { getStorage } from "firebase-admin/storage";

export default async function ProductsBanners(app: FastifyInstance) {
  const bucket = getStorage().bucket('gs://medicall-farma.appspot.com');

  app.get('/products-page-banners', async () => {
    const logos = await prisma.productsPageImages.findFirstOrThrow() 

    return logos
  })  

  app.post('/add-products-page-banners', async (request, reply) => {
    const bodySchema = z.object({
      faviritFirst: z.string(),
      faviritFirstId: z.string(),
      faviritSecound: z.string(),
      faviritSecoundId: z.string(),
      faviritFirstMobile: z.string(),
      faviritFirstMobileId: z.string(),
      faviritSecoundMobile: z.string(),
      faviritSecoundMobileId: z.string(),
      detailsFirst: z.string(),
      detailsFirstId: z.string(),
      detailsSecound: z.string(),
      detailsSecoundId: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { 
      detailsFirst,
      detailsFirstId,
      detailsSecound,
      detailsSecoundId,
      faviritFirst,
      faviritFirstId,
      faviritSecound,
      faviritSecoundId,
      faviritFirstMobile,
      faviritFirstMobileId,
      faviritSecoundMobile,
      faviritSecoundMobileId
    } = bodySchema.parse(request.body)

    const logos = await prisma.productsPageImages.create({
      data: {
        detailsFirst,
        detailsFirstId,
        detailsSecound,
        detailsSecoundId,
        faviritFirst, 
        faviritFirstId,
        faviritSecound,
        faviritSecoundId,
        faviritFirstMobile,
        faviritFirstMobileId,
        faviritSecoundMobile,
        faviritSecoundMobileId
      }
    }) 

    return logos
  })

  app.post('/edit-products-page-banners', async (request, reply) => {
    const bodySchema = z.object({
      faviritFirst: z.string(),
      faviritFirstId: z.string(),
      faviritSecound: z.string(),
      faviritSecoundId: z.string(),
      faviritFirstMobile: z.string(),
      faviritFirstMobileId: z.string(),
      faviritSecoundMobile: z.string(),
      faviritSecoundMobileId: z.string(),
      detailsFirst: z.string(),
      detailsFirstId: z.string(),
      detailsSecound: z.string(),
      detailsSecoundId: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const {
      detailsFirst,
      detailsFirstId,
      detailsSecound,
      detailsSecoundId,
      faviritFirst,
      faviritFirstId,
      faviritSecound,
      faviritSecoundId,
      faviritFirstMobile,
      faviritFirstMobileId,
      faviritSecoundMobile,
      faviritSecoundMobileId
    } = bodySchema.parse(request.body)

    const logoId = await prisma.productsPageImages.findFirstOrThrow()

    const logos = await prisma.productsPageImages.update({
      where: {
        id: logoId.id
      },
      data: {
        detailsFirst,
        detailsFirstId,
        detailsSecound,
        detailsSecoundId,
        faviritFirst,
        faviritFirstId,
        faviritSecound,
        faviritSecoundId,
        faviritFirstMobile,
        faviritFirstMobileId,
        faviritSecoundMobile,
        faviritSecoundMobileId
      }
    }) 

    return logos
  })

  app.delete('/remove-all-products-page-banners', async (request, reply) => {
    const logos = await prisma.productsPageImages.findMany()

    reply.status(404).send({
      statusCode: 404,
      message: 'Nenhuma imagem encontrada'
    })

    logos.forEach(async (logo) => {
      return await Promise.all([
        bucket.file(logo.detailsFirst).delete(),
        bucket.file(logo.detailsFirstId).delete(),
        bucket.file(logo.detailsSecound).delete(),
        bucket.file(logo.detailsSecoundId).delete(),
        bucket.file(logo.faviritFirst).delete(),
        bucket.file(logo.faviritFirstId).delete(),
        bucket.file(logo.faviritSecound).delete(),
        bucket.file(logo.faviritSecoundId).delete()
      ])
        .then(async () => {
          const deleteLogo = await prisma.productsPageImages.delete({
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
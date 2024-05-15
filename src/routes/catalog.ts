import { FastifyInstance } from "fastify";
import fastifyMultipart from "@fastify/multipart";
import { getStorage } from 'firebase-admin/storage'
import path from "path";
import { randomUUID } from "crypto";
import { AuthTokenVerify } from "../utils/authTokenVerify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export default async function Catalog(app: FastifyInstance) {
  const bucket = getStorage().bucket('gs://medicall-farma.appspot.com');

  app.get('/catalog',async () => {
    const catalog = await prisma.catalog.findFirstOrThrow()
    

    return catalog
  })
  
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25, // 25mb
    }
  })
  
  app.post('/upload-file', async (request, reply) => {
    const file = await request.file()

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }
    
    if(!file) {
      return reply.status(400).send({
        statusCode: 400,
        message: 'Adicione um arquivo'
      })
    }

    const extension = path.extname(file.filename)
    const fileBuffer = await file.toBuffer()

    const fileBaseName = path.basename(file.fieldname, extension)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
    
    const { fileName, link } = await bucket.file(fileUploadName).save(fileBuffer)
      .then(() => ({
        fileName: fileUploadName,
        link: `https://firebasestorage.googleapis.com/v0/b/medicall-farma.appspot.com/o/${fileUploadName}?alt=media`
      }))

    const catalog = await prisma.catalog.create({
      data: {
        link,
        fileName
      }
    })

    return catalog
  })

  app.put('/edit-file', async (request, reply) => {
    const file = await request.file()

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }
    if(!file) {
      return reply.status(400).send({
        statusCode: 400,
        message: 'Adicione um arquivo'
      })
    }

    const findCatalog = await prisma.catalog.findFirstOrThrow()

    const fileBuffer = await file.toBuffer()

    await bucket.file(findCatalog.fileName).delete()
    
    const { fileName, link } = await bucket.file(findCatalog.fileName).save(fileBuffer)
      .then(() => ({
        fileName: findCatalog.fileName,
        link: `https://firebasestorage.googleapis.com/v0/b/medicall-farma.appspot.com/o/${findCatalog.fileName}?alt=media`
      }))

    const catalog = await prisma.catalog.update({
      where: {
        id: findCatalog.id
      },
      data: {
        fileName,
        link
      }
    })

    return catalog
  })

  app.delete('/remove-catalog/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const catalog = await prisma.catalog.delete({
      where: {
        id
      }
    })

    return catalog
  })

  app.delete('/remove-all-catalogs', async (request, reply) => {
    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }
    
    const catalog = await prisma.catalog.deleteMany()

    return catalog
  })
}
import { FastifyInstance } from "fastify";
import fastifyMultipart from "@fastify/multipart";
import { getStorage } from 'firebase-admin/storage'
import path from "path";
import { randomUUID } from "crypto";
import z from 'zod'
import { AuthTokenVerify } from "../utils/authTokenVerify";

export default async function UploadImage(app: FastifyInstance) {
  const bucket = getStorage().bucket('gs://medicall-farma.appspot.com');
  
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25, // 25mb
    }
  })
  
  app.post('/upload-image', async (request, reply) => {
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
      
    return await bucket.file(fileUploadName).save(fileBuffer)
      .then(() => ({
        file_name: fileUploadName,
        link: `https://firebasestorage.googleapis.com/v0/b/medicall-farma.appspot.com/o/${fileUploadName}?alt=media`
      }))
  })

  app.put('/edit-image/:file_name', async (request, reply) => {
    const file = await request.file()

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const paramsScheme = z.object({
      file_name: z.string()
    })

    if(!file) {
      return reply.status(400).send({
        statusCode: 400,
        message: 'Adicione um arquivo'
      })
    }

    const { file_name } = paramsScheme.parse(request.params)

    const fileBuffer = await file.toBuffer()

    await bucket.file(file_name).delete()
    
    return await bucket.file(file_name).save(fileBuffer)
      .then(() => ({
        file_name: file_name,
        link: `https://firebasestorage.googleapis.com/v0/b/medicall-farma.appspot.com/o/${file_name}?alt=media`
      }))
  })

  app.delete('/delete-image/:file_name', async (request, reply) => {
    const paramsScheme = z.object({
      file_name: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { file_name } = paramsScheme.parse(request.params)

    return await bucket.file(file_name).delete()
      .then(() => ({
        data: 'Imagem deletada com sucesso!'
      }))
  })
}
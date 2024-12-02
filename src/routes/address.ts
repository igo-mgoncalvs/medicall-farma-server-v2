import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { AuthTokenVerify } from "../utils/authTokenVerify";

export async function Address (app: FastifyInstance) {
  app.get('/address', async () => {
    const address = await prisma.address.findFirstOrThrow()

    return address
  })

  app.post('/add-address', async (request, reply) => {
    const bodySchema = z.object({
      address: z.string(),
      link: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { address, link } = bodySchema.parse(request.body)

    const addAddress = await prisma.address.create({
      data: {
        address, 
        link
      }
    })

    return addAddress
  })

  app.put('/edit-address', async (request, reply) => {
    const bodySchema = z.object({
      address: z.string(),
      link: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { address, link } = bodySchema.parse(request.body)

    const findAddress = await prisma.address.findFirstOrThrow()

    const editAddress = await prisma.address.update({
      where: {
        id: findAddress.id
      },
      data: {
        address, 
        link
      }
    })

    return editAddress
  })

}
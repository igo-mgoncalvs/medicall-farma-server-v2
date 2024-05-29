import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import z from 'zod'
import { AuthTokenVerify } from "../utils/authTokenVerify";

export default async function Products(app: FastifyInstance) {
  app.get('/products', async () => {
    const productsGroups = await prisma.productsGroups.findMany({
      include: {
        products_list: {
          orderBy: {
            index: 'asc'
          }
        }
      },
      orderBy: {
        index: "asc"
      }
    })

    return productsGroups
  })

  app.post('/add-product', async (request, reply) => {
    const bodySchema = z.object({
      productsGroupsId: z.string(),
      image: z.string(),
      route: z.string(),
      name: z.string(),
      link: z.string().optional(),
      description: z.string(),
      whatsapp: z.string(),
      imageId: z.string(),
      summary: z.string(),
      index: z.number()
    })

    const idToken = request.headers.authorization?.replace('Bearer ', '')

    if(!idToken) {
      return reply.status(400).send({
        statusCode: 400,
        message: 'Authorization token not found'
      })
    }

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { description, image, route, name, link, productsGroupsId, whatsapp, imageId, summary, index } = bodySchema.parse(request.body)

    const product = await prisma.product.create({
      data: {
        description,
        image,
        imageId,
        link: link || '',
        name,
        route,
        summary,
        whatsapp,
        productsGroupsId,
        index
      }
    })

    return product
  })

  app.get('/find-product/:route', async (request) => {
    const paramsSchema = z.object({
      route: z.string()
    })

    const { route } = paramsSchema.parse(request.params)

    const product = await prisma.product.findUniqueOrThrow({
      where: {
        route
      }
    })

    return product
  })

  app.put('/edit-product/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const bodySchema = z.object({
      productsGroupsId: z.string(),
      image: z.string(),
      route: z.string(),
      name: z.string(),
      link: z.string().optional(),
      description: z.string(),
      whatsapp: z.string(),
      imageId: z.string(),
      summary: z.string(),
      index: z.number()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const { description, image, name, link, route, productsGroupsId, whatsapp, imageId, summary, index } = bodySchema.parse(request.body)

    const product = await prisma.product.update({
      where: {
        id
      },
      data: {
        description,
        image, 
        link: link || '',
        name,
        route,
        productsGroupsId,
        whatsapp,
        imageId,
        summary,
        index
      }
    })

    return product
  })

  app.put('/reorder-products', async (request, reply) => {
    const bodySchema = z.object({
      id: z.string(),
      index: z.number()
    }).array()

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const productsList = bodySchema.parse(request.body)

    productsList.forEach(async (item) => {
      await prisma.product.update({
        where: {
          id: item.id
        },
        data: {
          index: item.index
        }
      })
    })

  })

  app.put('/change-product-status/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const findStatus = await prisma.product.findUniqueOrThrow({
      where: {
        id
      }
    })

    const change = await prisma.product.update({
      where: {
        id
      },
      data: {
        active: !findStatus?.active
      }
    })

    return change
  })

  app.delete('/remove-product/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const findGroup = await prisma.product.findUniqueOrThrow({
      where: {
        id
      }
    })

    const product = await prisma.product.delete({
      where: {
        id
      }
    })

    const allSuppliers = await prisma.product.findMany({
      where: {
        productsGroupsId: findGroup.productsGroupsId
      }
    })

    async function reorderItens(
      list: {
        id: string,
        image: string,
        index?: number | null,
        name: string
      }[],
    ) {

      list.forEach(async (obj, ind) => {
        obj.index = ind

        await prisma.product.update({
          where: {
            id: obj.id
          },
          data: {
            ...obj,
            index: ind
          }
        })
      })
    }

    await reorderItens(allSuppliers)

    return product
  })

  app.delete('/remove-all-products', async () => {
    const product = prisma.product.deleteMany()
      .then(() => {
        return 'Todos os produtos foram removidos'
      })
      .catch(() => {
        return 'Erro ao deletar os produtos'
      })

    return product
  })
}
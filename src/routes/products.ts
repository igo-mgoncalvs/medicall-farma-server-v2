import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import z from 'zod'
import { AuthTokenVerify } from "../utils/authTokenVerify";

export default async function Products(app: FastifyInstance) {
  app.get('/products', async () => {
    const productsGroups = await prisma.productsGroups.findMany({
      include: {
        products_list: {
          include: {
            category: {
              select: {
                name: true
              }
            }
          },
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

  app.get('/all-products', async () => {
    const productsGroups = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        index: "asc"
      }
    })

    return productsGroups
  })

  app.get('/find-products-by-category/:categoryId', async (request) => {
    const paramsSchema = z.object({
      categoryId: z.string()
    })

    const { categoryId } = paramsSchema.parse(request.params)

    const productsGroups = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        index: "asc"
      },
      where: {
        categoryId
      }
    })

    return productsGroups
  })

  app.get('/search-products', async (request) => {
    const querySchema = z.object({
      search: z.string()
    })

    const { search } = querySchema.parse(request.query)

    const productsAll = await prisma.product.findMany()

    const regex = new RegExp(search, 'i');

    const products = productsAll.filter(product => regex.test(product.name))

    return products
  })

  app.get('/get-favorites', async () => {
    const productsGroups = await prisma.product.findMany({
      orderBy: {
        index: "asc"
      },
      where: {
        favorit: true
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
      subTitle: z.string().optional(),
      link: z.string().optional(),
      description: z.string(),
      whatsapp: z.string(),
      imageId: z.string(),
      summary: z.string(),
      index: z.number(),
      categoryId: z.string().optional(),
      favorit: z.boolean()
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

    const { description, image, route, name, subTitle, link, productsGroupsId, whatsapp, imageId, summary, index, categoryId, favorit } = bodySchema.parse(request.body)

    const product = await prisma.product.create({
      data: {
        description,
        image,
        imageId,
        link: link || '',
        name,
        subTitle: subTitle || "",
        route,
        summary,
        whatsapp,
        productsGroupsId,
        index,
        categoryId,
        favorit
      }
    })

    return product
  })

  app.get('/find-product/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const { id } = paramsSchema.parse(request.params)

    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id
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
      subTitle: z.string().optional(),
      link: z.string().optional(),
      description: z.string(),
      whatsapp: z.string(),
      imageId: z.string(),
      summary: z.string(),
      index: z.number(),
      categoryId: z.string(),
      favorit: z.boolean()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const { description, image, name, subTitle, link, route, productsGroupsId, whatsapp, imageId, summary, index, categoryId, favorit } = bodySchema.parse(request.body)

    const product = await prisma.product.update({
      where: {
        id
      },
      data: {
        description,
        image, 
        link: link || '',
        name,
        subTitle: subTitle || "",
        route,
        productsGroupsId,
        whatsapp,
        imageId,
        summary,
        index,
        categoryId,
        favorit
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

    return productsList.forEach(async (item) => {
      return await prisma.product.update({
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

  app.put('/favorite-product/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const { id } = paramsSchema.parse(request.params)

    const findProduct = await prisma.product.findFirstOrThrow({
      where: {
        id
      }
    })

    const product = await prisma.product.update({
      where: {
        id
      },
      data:{
        favorit: !findProduct.favorit
      }
    })

    return product
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
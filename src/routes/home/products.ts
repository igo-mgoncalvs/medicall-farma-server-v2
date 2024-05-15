import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma'
import z from 'zod'
import { randomUUID } from 'crypto'

export default async function HomeProducts (app: FastifyInstance) {
  app.get('/home-products-list', async () => {
    const products = await prisma.homeProductsList.findMany()

    return products
  })

  app.post('/add-home-products-list', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string()
    })

    const { name } = bodySchema.parse(request.body)

    let homeProductsId: string

    const findHomeProducts = await prisma.homeProducts.findFirst()

    if(findHomeProducts !== null) {
      homeProductsId = findHomeProducts.id
    } else {
      const createHomeProducts = await prisma.homeProducts.create({
        data: {
          id: randomUUID()
        }
      })

      homeProductsId = createHomeProducts.id
    }

    const products = await prisma.homeProductsList.create({
      data: {
        name
      }
    })

    return products
  })

  app.put('/edit-home-products-list/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const bodySchema = z.object({
      name: z.string()
    })

    const { id } = paramsSchema.parse(request.params)

    const { name } = bodySchema.parse(request.body)

    const products = await prisma.homeProductsList.update({
      where: {
        id
      },
      data: {
        name
      }
    })

    return products
  })

  app.delete('/delete-home-products-list/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const { id } = paramsSchema.parse(request.params)

    const products = await prisma.homeProductsList.delete({
      where: {
        id
      }
    })

    return products
  })

  app.get('/home-product', async () => {
    const product = await prisma.homeProducts.findFirstOrThrow({
      include: {
        products_list: true
      }
    })

    return product
  })

  app.post('/add-home-product', async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      image: z.string(),
      imageId: z.string(),
      button_text: z.string(),
      button_link: z.string()
    })

    const { button_link, button_text, image, imageId, title } = bodySchema.parse(request.body)

    const product = await prisma.homeProducts.create({
      data: {
        button_link,
        button_text,
        image,
        imageId,
        title
      }
    })

    const findHome = await prisma.home.findFirst()

    if(findHome?.id) {
      await prisma.home.update({
        where: {
          id: findHome.id
        },
        data: {
          homeProductsId: product.id
        }
      })
    } else {
      await prisma.home.create({
        data: {
          homeProductsId: product.id
        }
      })
    }

    return product
  })

  app.put('/edit-home-product', async (request, reply) => {
    const bodySchema = z.object({
      title: z.string(),
      image: z.string(),
      imageId: z.string(),
      button_text: z.string(),
      button_link: z.string(),
      enable: z.boolean()
    })

    const { button_link, button_text, image, imageId, title, enable } = bodySchema.parse(request.body)

    const findHomeProduct = await prisma.homeProducts.findFirstOrThrow()

    const product = await prisma.homeProducts.update({
      where: {
        id: findHomeProduct.id
      },
      data: {
        button_link,
        button_text,
        image,
        imageId,
        title,
        enable
      }
    })

    return product
  })
}
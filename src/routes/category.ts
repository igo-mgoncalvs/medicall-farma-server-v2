import { FastifyInstance } from "fastify/types/instance"
import { prisma } from "../lib/prisma"
import { z } from "zod"
import { AuthTokenVerify } from "../utils/authTokenVerify"

export default async function Category(app: FastifyInstance) {
  app.post('/categories', async (request) => {
    const bodySchema = z.object({
      productsGroupsId: z.string()
    })
    
    console.log(request.body)
    const { productsGroupsId } = bodySchema.parse(request.body)

    const categories = await prisma.category.findMany({
      where: {
        productsGroupsId,
      },
      orderBy: {
        index: 'asc'
      },
    })
    
    return categories
  })

  app.post('/add-category', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      productsGroupsId: z.string()
    })

    const { name, productsGroupsId } = bodySchema.parse(request.body)

    const regex = /[^a-zA-Z0-9\s-]/;

    function textTransform(text: string) {
      let textTransformed = text.trim();
    
      textTransformed = textTransformed.toLowerCase();
    
      textTransformed = textTransformed.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
      textTransformed = textTransformed.replace(/[\s,]+/g, '-');
    
      return textTransformed;
    }

    if(regex.test(textTransform(name))){
      reply.status(406).send({
        statusCode: 406,
        message: 'A cartegoria não pode conter caracteres especiais'
      })

      return
    }

    const categoriesLength = await prisma.category.count({
      where: {
        productsGroupsId
      }
    })

    const category = await prisma.category.create({
      data: {
        id: textTransform(name),
        name,
        productsGroupsId,
        index: categoriesLength,
      },
    })
      .catch((error) =>  {
        if(error.code === 'P2002'){
          reply.status(400).send({
            statusCode: 400,
            message: 'A categoria já foi criada'
          })
        }
      })

    return category
  })

  app.put('/edit-category/:id', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      productsGroupsId: z.string()
    })

    const paramsSchema = z.object({
      id: z.string()
    })

    const { name, productsGroupsId } = bodySchema.parse(request.body)

    const { id } = paramsSchema.parse(request.params)

    const regex = /[^a-zA-Z0-9\s-]/;

    function textTransform(text: string) {
      let textTransformed = text.trim();
    
      textTransformed = textTransformed.toLowerCase();
    
      textTransformed = textTransformed.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
      textTransformed = textTransformed.replace(/[\s,]+/g, '-');
    
      return textTransformed;
    }

    if(regex.test(textTransform(name))){
      reply.status(406).send({
        statusCode: 406,
        message: 'A cartegoria não pode conter caracteres especiais'
      })

      return
    }

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        id: textTransform(name),
        name,
        productsGroupsId,
      },
    })
      .catch((error) =>  {
        if(error.code === 'P2002'){
          reply.status(400).send({
            statusCode: 400,
            message: 'A categoria já foi criada'
          })
        }
      })

    await prisma.product.updateMany({
      where: {
        categoryId: id
      },
      data: {
        categoryId:  textTransform(name)
      }
    })

    return category
  })

  app.put('/reorder-categories', async (request, reply) => {
    const bodySchema = z.object({
      id: z.string(),
      index: z.number()
    }).array()

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const groupsList = bodySchema.parse(request.body)

    return groupsList.forEach(async (item) => {
      return await prisma.category.update({
        where: {
          id: item.id
        },
        data: {
          index: item.index
        }
      })
    })
  })

  app.put('/change-category-status/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const { id } = paramsSchema.parse(request.params)

    const categoryStatus = await prisma.category.findUniqueOrThrow({
      where: {
        id
      }
    })

    const category = await prisma.category.update({
      where: {
        id
      },
      data: {
        active: !categoryStatus.active
      }
    })

    return category
  })

  app.delete('/category/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const { id } = paramsSchema.parse(request.params)

    const verifyCategory = await prisma.product.findMany({
      where: {
        categoryId: id
      }
    })

    if(verifyCategory.length > 0) {
      const pluralS = verifyCategory.length > 1 ? 's' : ''
      const pluralM = verifyCategory.length > 1 ? 'm' : ''

      reply.status(409).send({
        statusCode: 409,
        message: `Existe${pluralM} ${verifyCategory.length} produto${pluralS} vinculado${pluralS} a essa categoria`
      })

      return
    }

    const categories = await prisma.category.delete({
      where: {
        id
      }
    })
    
    return categories
  })

  app.delete('/categories', async () => {
    const categories = await prisma.category.deleteMany()
    
    return categories
  })
}
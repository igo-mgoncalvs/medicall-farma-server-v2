import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import z from 'zod'
import { AuthTokenVerify } from "../utils/authTokenVerify";

export default async function Suppliers (app: FastifyInstance) {
  app.get('/suppliers-interface', async () => {
    const suppliers = await prisma.suppliersScreen.findFirstOrThrow()

    return suppliers
  })

  app.get('/suppliers', async () => {
    const suppliers = await prisma.suppliers.findMany({
      orderBy: {
        index: "asc"
      }
    })
    
    return suppliers || []
  })
  
  app.post('/add-suppliers', async (request, reply) => {
    const bodySchema = z.object({
      image: z.string(),
      name: z.string(),
      index: z.number()
    })
    
    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }
    
    const { image, name, index } = bodySchema.parse(request.body)

    const suppliers = await prisma.suppliers.create({
      data: {
        image,
        name,
        index
      }
    })

    return suppliers
  })

  app.get('/find-suppliers/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const suppliers = await prisma.suppliers.findFirstOrThrow({
      where: {
        id
      },
    })

    return suppliers
  })

  app.put('/edit-suppliers/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const bodySchema = z.object({
      image: z.string(),
      name: z.string(),
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const { image, name } = bodySchema.parse(request.body)

    const suppliers = await prisma.suppliers.update({
      where: {
        id
      },
      data: {
        name,
        image,
      }
    })

    return suppliers
  })

  app.put('/reorder-suppliers', async (request, reply) => {
    const bodySchema = z.object({
      id: z.string(),
      index: z.number()
    }).array()

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const suppliersList = bodySchema.parse(request.body)

    return suppliersList.forEach(async (item) => {
      return await prisma.suppliers.update({
        where: {
          id: item.id
        },
        data: {
          index: item.index
        }
      })
    })

  })

  app.delete('/remove-supplier/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }
    const { id } = paramsSchema.parse(request.params)

    const suppliers = prisma.suppliers.delete({
      where: {
        id
      }
    })

    const allSuppliers = await prisma.suppliers.findMany()

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

        await prisma.suppliers.update({
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

    return suppliers 
  })

  app.delete('/remove-all-suppliers', async (request, reply) => {
    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const suppliers = prisma.suppliers.deleteMany()
      .then(() => {
        return 'Todos os fornecedores foram removidos'
      })
      .catch(() => {
        return 'Erro ao deletar os fornecedores'
      })

    return suppliers
  })
  
  let listTeste = [
    {
      index: 0,
      name: '1',
    },
    {
      index: 1,
      name: '2',
    },
    {
      index: 2,
      name: '3',
    },
    {
      index: 3,
      name: '4',
    },
    {
      index: 4,
      name: '5',
    }
  ]  

  app.post('/edit-suppliers', async (request) => {
    const bodySchema = z.object({
      name: z.string(),
      index: z.number()
    })

    const { index, name } = bodySchema.parse(request.body)

    function teste (list: {
      index: number,
      name: string
    }[], fromIndex: number, toIndex: number) {

      const [ removed ] = list.splice(fromIndex, 1)
      list.splice(toIndex, 0, removed)

      list.forEach((obj, ind) => {
        obj.index = ind
      })

      console.log(list)
    }

    const fromIndex = listTeste.findIndex((e) => e.name === name)

    teste(listTeste, fromIndex, index)
  })
}
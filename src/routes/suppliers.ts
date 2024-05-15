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
    const suppliers = await prisma.suppliers.findMany()

    const sort = suppliers.sort((a, b) => Number(a.index) > Number(b.index) ? 1 : -1)
    
    return sort || []
  })
  
  app.post('/add-suppliers', async (request, reply) => {
    const bodySchema = z.object({
      image: z.string(),
      name: z.string()
    })
    
    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }
    
    const { image, name } = bodySchema.parse(request.body)

    const suppliers = await prisma.suppliers.create({
      data: {
        image,
        name
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
      index: z.number()
    })

    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }

    const { id } = paramsSchema.parse(request.params)

    const { image, name, index } = bodySchema.parse(request.body)

    const allSuppliers = await prisma.suppliers.findMany()

    async function reorderList(
      list: {
        id: string,
        image: string,
        index?: number | null,
        name: string
      }[],
      fromIndex: number,
      toIndex: number
    ) {
      // Verifica se os índices são válidos
      if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex > list.length) {
          console.error("Índices fora do intervalo da lista");
          return list;
      }
  
      // Remove o item do índice original
      const [item] = list.splice(fromIndex , 1);
  
      // Insere o item no novo índice
      list.splice(toIndex - 1, 0, item);
      
      list.forEach((obj, idx) => {
        obj.index = idx + 1
      });
      
      await list.forEach(async (obj) => {
        await prisma.suppliers.update({
          where: {
            id: obj.id
          },
          data: obj
        })
      })

      return list
    }

    const fromIndex = allSuppliers.find((e) => e.id === id)

    if(!fromIndex?.index) {
      return null
    }

    reorderList(allSuppliers, fromIndex?.index, index)

    const suppliers = await prisma.suppliers.update({
      where: {
        id
      },
      data: {
        name,
        image,
        index
      }
    })

    return suppliers
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
}
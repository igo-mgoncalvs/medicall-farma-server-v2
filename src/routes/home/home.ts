import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from 'zod'

export default async function Home(app: FastifyInstance) {
  app.get('/home', async () => {
    const getHome = await prisma.home.findFirstOrThrow({
      include: {
        catalog: true,
        main: true,
        products: true,
        welcome: true
      }
    })

    return getHome
  })

}
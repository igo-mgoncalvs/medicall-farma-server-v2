import { FastifyInstance } from "fastify";
import z from 'zod'
import { prisma } from "../../lib/prisma";

export default async function AboutUs(app: FastifyInstance) {
  app.get('/about-us-interface', async () => {
    const aboutUs = await prisma.aboutUs.findFirstOrThrow({
      include: {
        banners: true,
        directors: true,
        history: true,
        space: {
          include: {
            images: true
          }
        },
        team: true,
        values: true
      }
    })

    return aboutUs
  })
}
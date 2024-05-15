import { FastifyInstance } from "fastify";
import { AuthTokenVerify } from "../utils/authTokenVerify";

export default async function TokenVerify (app: FastifyInstance) {
  app.get('/token-verify', async (request, reply) => {
    const auth = await AuthTokenVerify({token: request.headers.authorization, reply})

    if(auth === 'error') {
      return null
    }
  })
}
import { FastifyReply } from "fastify"
import { getAuth } from "firebase-admin/auth"

interface IProps {
  token: string | undefined,
  reply: FastifyReply
}

export async function AuthTokenVerify({ token, reply }: IProps) {
  const idToken = token?.replace('Bearer ', '')

  if(!idToken) {
    reply.status(400).send({
      statusCode: 400,
      message: 'Authorization token not found'
    })

    return 'error'
  }
  
  return await getAuth().verifyIdToken(idToken)
    .catch((error) => {
      if (error.code === 'auth/id-token-expired') {
        reply.status(401).send({
          statusCode: 401,
          message: 'Token expired'
        })

        return 'error'
      } else {
        reply.send(error)

        return 'error'
      }
    })
}
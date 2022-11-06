import { FastifyInstance } from "fastify"
import ShortUniqueId from "short-unique-id"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function poolRoutes(fastify: FastifyInstance) {
  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()

    return { count }
  })

  fastify.post('/pools', async (request, reply) => {
    const create_pool_body = z.object({
      title: z.string()
    })

    const { title } = create_pool_body.parse(request.body)

    const generated_code = new ShortUniqueId({ length: 6 })
    const code = String(generated_code()).toUpperCase()

    try {
      await request.jwtVerify()

      await prisma.pool.create({
        data: {
          title,
          code,
          owner_id: request.user.sub,

          participants: {
            create: {
              user_id: request.user.sub
            }
          }
        },
      })

      return reply.status(201).send({ code })
    } catch {
      await prisma.pool.create({
        data: {
          title,
          code,
        }
      })
    }
  })

  fastify.post('/pools/:code/join',{
    onRequest: [authenticate]
  }, async (request, reply) => {
    const joinPoolBody = z.object({
      code: z.string()
    })

    const { code } = joinPoolBody.parse(request.body)

    const pool = await prisma.pool.findUnique({
      where: {
        code,
      },
      include: {
        participants: {
          where: {
            user_id: request.user.sub
          }
        }
      }
    })

    if (!pool) {
      return reply.status(404).send({
        error: 'Pool not found'
      })
    }

    if (pool.participants.length > 0) {
      return reply.status(409).send({
        error: 'User already joined this pool'
      })
    }

    if (!pool.owner_id) {
      await prisma.pool.update({
        where: {
          id: pool.id,
        },
        data: {
          owner_id: request.user.sub
        }
      })
    }

    await prisma.participant.create({
      data: {
        user_id: request.user.sub,
        pool_id: pool.id
      }
    })

    return reply.status(201).send()
  })
}

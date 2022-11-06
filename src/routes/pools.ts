import { FastifyInstance } from "fastify"
import ShortUniqueId from "short-unique-id"
import { z } from "zod"
import { prisma } from "../lib/prisma"

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

    const pool = await prisma.pool.create({
      data: {
        title,
        code
      },
    })

    return reply.status(201).send({ code })
  })
}

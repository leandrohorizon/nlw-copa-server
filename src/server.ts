import Fastify from 'fastify'
import cors from '@fastify/cors'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import ShortUniqueId from 'short-unique-id'

const prisma = new PrismaClient({
  log: ['query'],
})

async function bootstrap() {
  let fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true,
  })

  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()

    return { count }
  })

  fastify.get('/users/count', async () => {
    const count = await prisma.user.count()

    return { count }
  })

  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count()

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

  await fastify.listen({ host: '0.0.0.0', port: 3333 })
}

bootstrap()

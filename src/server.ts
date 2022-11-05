import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query'],
})

async function bootstrap() {
  let fastify = Fastify({
    logger: true,
  })

  fastify.get('/pools/count', () => {
    const count = prisma.pool.count()

    return { count: count }
  })

  await fastify.listen({ port: 3333 })
}

bootstrap()

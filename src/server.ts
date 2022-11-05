import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

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

  fastify.get('/pools/count', () => {
    const count = prisma.pool.count()

    return { count: count }
  })

  await fastify.listen({ host: '0.0.0.0', port: 3333 })
}

bootstrap()

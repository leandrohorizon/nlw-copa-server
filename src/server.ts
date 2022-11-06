import Fastify from 'fastify'
import cors from '@fastify/cors'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import ShortUniqueId from 'short-unique-id'
import { poolRoutes } from './routes/pools'
import { authRoutes } from './routes/auth'
import { gameRoutes } from './routes/game'
import { guessRoutes } from './routes/guess'
import { userRoutes } from './routes/user'

async function bootstrap() {
  let fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true,
  })

  fastify.register(authRoutes)
  fastify.register(gameRoutes)
  fastify.register(guessRoutes)
  fastify.register(poolRoutes)
  fastify.register(userRoutes)

  await fastify.listen({ /*host: '0.0.0.0',*/ port: 3333 })
}

bootstrap()

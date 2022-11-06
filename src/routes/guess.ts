import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count()

    return { count }
  })

  fastify.post('/pools/:pool_id/games/:game_id/guesses', {
    onRequest: [authenticate]
  },async (request, reply) => {
    const createGuessParams = z.object({
      pool_id: z.string(),
      game_id: z.string()
    })

    const createGuessBody = z.object({
      first_team_points: z.number(),
      second_team_points: z.number()
    })

    const { pool_id, game_id } = createGuessParams.parse(request.params)
    const { first_team_points, second_team_points } = createGuessBody.parse(request.body)

    const participant = await prisma.participant.findUnique({
      where: {
        user_id_pool_id: {
          pool_id,
          user_id: request.user.sub,
        }
      }
    })

    if (!participant) {
      return reply.status(404).send({
        error: "you're not allowed to create a guess inside this pool",
      })
    }

    const guess = await prisma.guess.findUnique({
      where: {
        participant_id_game_id: {
          participant_id: participant.id,
          game_id,
        }
      }
    })

    if (guess) {
      return reply.status(409).send({
        error: "you already sent a guess to this game on this pool",
      })
    }

    const game = await prisma.game.findUnique({
      where: {
        id: game_id,
      }
    })

    if (!game) {
      return reply.status(404).send({
        error: "game not found",
      })
    }

    if (game.date < new Date()) {
      return reply.status(409).send({
        error: "you can't send a guess to a game that already happened",
      })
    }

    await prisma.guess.create({
      data: {
        game_id,
        participant_id: participant.id,
        first_team_points,
        second_team_points,
      }
    })

    return reply.status(201).send()
  })
}

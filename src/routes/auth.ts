import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/users', async (request) => {
    const create_user_body = z.object({
      access_token: z.string(),
    })

    const { access_token } = create_user_body.parse(request.body)

    const user_response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const user_data = await user_response.json()

    const user_info_schema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    })

    const user_info = user_info_schema.parse(user_data)

    let user = await prisma.user.findUnique({
      where: {
        google_id: user_info.id,
      }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          google_id: user_info.id,
          email: user_info.email,
          name: user_info.name,
          avatar_url: user_info.picture,
        }
      })
    }

    const token = fastify.jwt.sign({
      name: user.name,
      avatar_url: user.avatar_url,
    }, {
      sub: user.id,
      expiresIn: '7 days',
    })

    return { token }
  })
}

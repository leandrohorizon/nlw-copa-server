import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(){
  const user = await prisma.user.create({
    data: {
      name: 'leandrohorizon',
      email: 'leandro@gmail.com',
      avatar_url: 'https://github.com/leandrohorizon.png'
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: 'BOL123',
      owner_id: user.id,

      participants: {
        create: {
          user_id: user.id,
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-20T12:00:00.000Z',
      first_team_country_code: 'BR',
      second_team_country_code: 'AR',
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-20T12:00:00.000Z',
      first_team_country_code: 'BR',
      second_team_country_code: 'DE',

      guesses: {
        create: {
          first_team_points: 2,
          second_team_points: 1,

          participant: {
            connect: {
              user_id_pool_id: {
                user_id: user.id,
                pool_id: pool.id
              }
            }
          }
        }
      }
    }
  })
}

main()

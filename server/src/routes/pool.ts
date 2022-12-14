import { FastifyInstance } from 'fastify'
// Schema de validação do zod e integração com typescript
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'

export async function poolRoutes(fastify: FastifyInstance) {
  //Criando Minha primeira rota
  fastify.get('/pools/count', async () => {
    //Eu consigo realizar querys no banco de dados com o prisma, nesse caso eu estou indo na tabela pool e pesquisando todos os codigos que começa com D
    // const pools = await prisma.pool.findMany({
    //   where:{
    //     code:{
    //       startsWith: 'D'
    //     }
    //   }
    // })
    const count = await prisma.pool.count()
    return { count }
  })

  fastify.post('/pools', async (request, reply) => {
    // aqui estou falando que o corpo(request.body) da requisição tem que ser um objeto com as propriedades dele code e title, o tipo de cada uma e que nao pode ser nulo
    const createPoolBody = z.object({
      title: z.string()
    })
    // const { title } = request.body
    const { title } = createPoolBody.parse(request.body)

    const generate = new ShortUniqueId({ length: 6 })
    const code = String(generate()).toUpperCase()

    try {
      await request.jwtVerify()
      await prisma.pool.create({
        data: {
          title,
          code,
          owenerId: request.user.sub,

          Participants: {
            create: {
              userId: request.user.sub
            }
          }
        }
      })
    } catch {
      await prisma.pool.create({
        data: {
          title,
          code
        }
      })
    }

    return reply.status(201).send({
      code
    })
    // return { title }
  })

  fastify.post(
    '/pools/join',
    {
      onRequest: [authenticate]
    },
    async (request, reply) => {
      const joinPoolBody = z.object({
        code: z.string()
      })

      const { code } = joinPoolBody.parse(request.body)

      const pool = await prisma.pool.findUnique({
        where: {
          code
        },
        include: {
          Participants: {
            where: {
              userId: request.user.sub
            }
          }
        }
      })

      if (!pool) {
        return reply.status(400).send({
          message: 'Pool not found.'
        })
      }

      if (pool.Participants.length > 0) {
        return reply.status(400).send({
          message: 'You already join this pool.'
        })
      }

      if (!pool.owenerId) {
        await prisma.pool.update({
          where: {
            id: pool.id
          },
          data: {
            owenerId: request.user.sub
          }
        })
      }

      await prisma.participant.create({
        data: {
          poolId: pool.id,
          userId: request.user.sub
        }
      })

      return reply.status(201).send()
    }
  )

  fastify.get(
    '/pools',
    {
      onRequest: [authenticate]
    },
    async request => {
      const pools = await prisma.pool.findMany({
        where: {
          Participants: {
            some: {
              userId: request.user.sub
            }
          }
        },
        include: {
          _count: {
            select: {
              Participants: true
            }
          },
          Participants: {
            select: {
              id: true,

              user: {
                select: {
                  avatarUrl: true
                }
              }
            },
            take: 4
          },
          owener: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      return { pools }
    }
  )

  fastify.get(
    '/pools/:id',
    {
      onRequest: [authenticate]
    },
    async request => {
      const getPoolParams = z.object({
        id: z.string()
      })

      const { id } = getPoolParams.parse(request.params)

      const pool = await prisma.pool.findUnique({
        where: {
          id
        },
        include: {
          _count: {
            select: {
              Participants: true
            }
          },
          Participants: {
            select: {
              id: true,

              user: {
                select: {
                  avatarUrl: true
                }
              }
            },
            take: 4
          },
          owener: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      return { pool }
    }
  )
}

import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'

export async function authRoutes(fastify: FastifyInstance) {
  // Validação do JWT
  fastify.get(
    '/me',
    {
      onRequest: [authenticate]
    },
    async request => {
      return { user: request.user }
    }
  )
  // Post porque estamos criando uma nova sessão de login caso exista no google e com isso, criação de usuário no banco
  fastify.post('/users', async (request, reply) => {
    // Primeiro vamos validar o corpo da requisição, se realmente estamos recebendo o que esperamos, no caso o token em string que não pode ser nulo
    const createUserBody = z.object({
      access_token: z.string()
    })
    const { access_token } = createUserBody.parse(request.body)

    // Agora vamos fazer a requisição para o google para pegar as informações do usuário, atraves do token passado. Esse token vem do mobile, fazendo o login pela api da google que devolve um token e que é passado para ca
    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    )
    const userData = await userResponse.json()

    // Agora validamos se realmente esta chegando o que esperamos na req da api da google passando o token
    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url()
    })
    const userInfo = userInfoSchema.parse(userData)

    // Criamos o usuario com os dados:
    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id
      }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          avatarUrl: userInfo.picture
        }
      })
    }

    // Dentro do token a gente pode colocar info, é como se fosse um hascode com os dados do usuario dentro. So que mesmo assim o usuario pode acessar os dados dentro desse token, por isso não é legal colocar informações secretas do usuario
    const token = fastify.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl
      },
      {
        sub: user.id,
        expiresIn: '7 days'
      }
    )

    // Retornamos o user
    console.log(userInfo)
    console.log(token)
    return { token }
  })
}

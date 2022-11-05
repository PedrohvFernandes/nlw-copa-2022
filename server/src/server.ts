// Mini framework é tipo o express so que mais leve, que facilita a criação de rotas na aplicação, autenticação e etc
import Fastify from 'fastify'
import cors from '@fastify/cors'
// Schema de validação do zod e integração com typescript
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import ShortUniqueId from 'short-unique-id'

const prisma = new PrismaClient({
  // O prisma vai dar um log de todas as querys que foram feitas no banco de dados
  log: ['query']
})

async function bootstrap() {
  const fastify = Fastify({
    // Para logar tudo que for de erro
    logger: true
  })

  await fastify.register(cors, {
    // Aqui o ideal é colocar o dominio do front-end e nao true, porque com true qualquer um pode acessar a api
    origin: true
  })

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

  fastify.get('/users/count', async () => {
    const count = await prisma.user.count()
    return { count }
  })

  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count()
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

    await prisma.pool.create({
      data: {
        title,
        code: code
      }
    })

    return reply.status(201).send({
      code
    })
    // return { title }
  })

  await fastify.listen({
    port: 3333
    // host: '0.0.0.0'
  })
}

bootstrap()

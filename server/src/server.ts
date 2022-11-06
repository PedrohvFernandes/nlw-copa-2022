// Mini framework é tipo o express so que mais leve, que facilita a criação de rotas na aplicação, autenticação e etc
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

// rotas
import { poolRoutes } from './routes/pool'
import { gameRoutes } from './routes/game'
import { authRoutes } from './routes/auth'
import { userRoutes } from './routes/user'
import { guessRoutes } from './routes/guess'

async function bootstrap() {
  const fastify = Fastify({
    // Para logar tudo que for de erro
    logger: true
  })

  await fastify.register(cors, {
    // Aqui o ideal é colocar o dominio do front-end e nao true, porque com true qualquer um pode acessar a api
    origin: true
  })

  // JWT É um hash gerado no backend para identificar o usuário logado
  // Em produção, o ideal é colocar uma variavel ambiente .env ou seja pode ser qualquer string mas que esteja em .env
  await fastify.register(jwt, {
    // Chave secreta para gerar e validar o token
    secret: 'nlwcopa'
  })

  // As rotas são registradas aqui e viram plugins/middleware do fastify
  await fastify.register(poolRoutes)
  await fastify.register(authRoutes)
  await fastify.register(gameRoutes)
  await fastify.register(guessRoutes)
  await fastify.register(userRoutes)

  await fastify.listen({
    port: 3333,
    host: '0.0.0.0'
  })
}

bootstrap()

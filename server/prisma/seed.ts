// O seed serve para a gente conseguir popular o banco de dados com dados iniciais para futuramente dar manutenção e testes, sem precisar ficar criando dados manualmente e perdendo tempo.
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      avatarUrl: 'github.com/PedrohvFernandes.png'
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Pool 1',
      code: 'BOL123',
      owenerId: user.id,
      // inserções encadeadas, que a onde o usuário é criado antes. Com isso, cria o pool criando e encadeado ao usuario ao mesmo tempo.
      Participants: {
        create: {
          userId: user.id
        }
      }
    }
  })

  // Em vez de fazer assim, podemos fazer inserções encadeadas, na propria tabela pool

  // const participant = await prisma.participant.create({
  //   data: {
  //     poolId: pool.id,
  //     userId: user.id,
  //   }
  // })

  await prisma.game.create({
    data: {
      // Quando for salvar datas no banco, sempre salva ela com timestamp, porque se enviar a data e o horario dessa forma: 18:00:00 é 18 horas mas em que timezone do Brasil ?
      date: '2022-11-03T14:26:58.176Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR'
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-05T14:26:58.176Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses:{
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,

          participant: {
            // Aqui se faz a inserção encadeada, so que em vez criar e conectar um participant, a gente simplesmente conecta uma coisa na outra formando um palpite nesse especifico game.
            connect: {
              userId_poolId:{
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })
}

main()

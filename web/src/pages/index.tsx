import Image from 'next/image'
import appPreviewImg from '../assets/ap-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarsExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number
  guessCountResponse: number
  userCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()
    try {
      const response = await api.post('/pools', {
        title: poolTitle
      })

      const { code } = response.data

      // Copiando para area de transferencia o codigo gerado
      await navigator.clipboard.writeText(code)

      alert('Bolão criado com sucesso e copiada para area de transferência, o código é: ' + code)
      setPoolTitle('')
    } catch (err) {
      console.log(err)
      alert('Erro ao criar pool')
    }
  }
  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="nlw copa" quality={100} />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarsExampleImg} alt="" quality={100} />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100 outline-none"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700 transition-all"
          >
            Criar o meu bolão
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        {/* divide-x --> divide um container colocando barrar que tem conteudos dentro dela */}
        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" quality={100} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados </span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600"></div>
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" quality={100} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">
                +{props.guessCountResponse}
              </span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW copa"
        quality={100}
      />
    </div>
  )
}

// Essa função retorna um valor para o propio componente, que pode ser usado como uma propiedade https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props Caching with Server-Side Rendering(ssr) rodando do lado do servidor, porque dessa maneira se a pessoa tiver com javascript desativado no navegador, ela mesmo assim vai conseguir ver o conteudo na tela:
// Chamadas https que sejam executadas do lado do servidor pelo Next, isso é chamadas que eu preciso que sejam indexadas pelas buscas do google
export const getServerSideProps = async () => {
  // const poolCountResponse = await api.get('pools/count')
  // const guessCountResponse = await api.get('guesses/count')
  // As chamadas não devem depender de uma para a outra começar. Com isso usamos isso: é uma concorrencia, a onde as duas sao executadas paralelamente
  const [poolCountResponse, guessCountResponse, usersCountResponse] =
    await Promise.all([
      api.get('pools/count'),
      api.get('guesses/count'),
      api.get('users/count')
    ])
  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCountResponse: guessCountResponse.data.count,
      userCount: usersCountResponse.data.count
    }
  }
}

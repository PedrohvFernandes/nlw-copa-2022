import '../styles/global.css'

// Esse arquivo _app é como se fosse o arquivo principal da aplicação ou global da aplicação 
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

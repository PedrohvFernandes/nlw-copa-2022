// Nosso contexto de autenticação
import React, { createContext, useEffect } from 'react'
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { api } from '../services/api'

// Garante o redirecionamento do navegador da autenticação da google para o app
WebBrowser.maybeCompleteAuthSession()

interface UserProps {
  name: string
  avatarUrl: string
}

export interface AuthContextDataProps {
  user: UserProps
  isUserLoading: boolean
  signIn: () => Promise<void>
}

interface AuthProviderProps {
  // Um no do react que pode receber qualquer coisa
  children: React.ReactNode
}

//Essa função armazena qual que é o conteudo que o meu contexto vai compartilhar, um objeto
export const AuthContext = createContext({} as AuthContextDataProps)

// Esse ja vai permitir que a gente compartilhe esse nosso contexto com toda nossa aplicação
export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<UserProps>({} as UserProps)
  const [isUserLoading, setIsUserLoading] = React.useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:process.env.CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    // Esse escope é configurado no cosole do google, para que o google saiba o que ele vai ter acesso
    scopes: ['profile', 'email']
  })

  console.log(AuthSession.makeRedirectUri({ useProxy: true }))

  async function signIn() {
    try {
      setIsUserLoading(true)
      // Essa função starta o processo de autenticação
      await promptAsync()
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      setIsUserLoading(false)
    }

    console.log('Vamos logar!')
  }

  async function signInWithGoogle(access_token: string) {
    console.log('TOKEN DE AUTENTICAÇÃO =======>', access_token)
    try{
      setIsUserLoading(true)

     const tokenResponse =  await api.post('/users', {
        access_token
      })
      console.log(tokenResponse.data)

      // Logo após realizar o login recebemos um Bearer token do backend que indica que estamos autenticados para realizar as requisições. Como podemos informar para nossa aplicação o token para que ele possa estar presente em todas as requisições? 
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`

      const userInfoResponse = await api.get('/me')
      setUser(userInfoResponse.data.user)

    }catch(error){
      console.log(error)
      throw error
    }finally{
      setIsUserLoading(false)
    }
  }

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  return (
    // Dessa forma nos repassamos o contexto para toda nossa aplicação, quem é o usuario logado. E para usar transformamos em um hook useAuth
    // <AuthContext.Provider
    //   value={{
    //     signIn,
    //     isUserLoading,
    //     user: {
    //       name: 'Pedro',
    //       avatarUrl: 'https://github.com/pedrohvfernandes.png'
    //     }
    //   }}
    // >
    //   {children}
    // </AuthContext.Provider>

    // Dessa maneira eu eu passo o usuario logado so que dinamicamente, com um hook de estado, com os dados que vem da api
    <AuthContext.Provider
      value={{
        signIn,
        isUserLoading,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

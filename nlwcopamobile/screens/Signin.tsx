// native-base = componentes universais para todo tipo de aplicação
// Essa VStack é a mesma coisa que a View do React Native, mas que tem um display flex so que column, ou seja, ela é uma view que fica um embaixo do outro e que ja vem com as propriedades do display flex: <VStack flex={1} bgColor="fuchsia.400" alignItems="center" justifyContent="center">
// Tem o center que não precisa colocar essas propriedades para centralizar
// o Text é tipo do react-native, mas que ja possui propriedades proprias de estilização, dessa forma a gente nao precisa usar o stylesheet e nem o propio react-native
import { Text, VStack, Center, Icon } from 'native-base'
import { Fontisto } from '@expo/vector-icons'
// Com esse hook, conseguimos compartilhar todo o contexto de login para a aplicação
import { useAuth } from '../src/hooks/useAuth'
import {useState} from 'react'

import Logo from '../src/assets/logo.svg'
import { Button } from '../src/components/Button'

export function SignIn() {

  const { signIn, isUserLoading  } = useAuth()
  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      <Logo width={212} height={40} />
      <Button
        type="SECONDARY"
        title="ENTRAR COM GOOGLE"
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
        mt={12}
        onPress={signIn}
        isLoading={isUserLoading}
      />
      <Text color="white" textAlign="center" mt={4}>
        Não utilizamos nenhuma informação além {'\n'} do seu e-mail para criação
        de sua conta.
      </Text>
    </Center>
  )
}

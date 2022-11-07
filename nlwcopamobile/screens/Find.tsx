import { useState } from 'react'
import { Heading, useToast, VStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'

import { api } from '../src/services/api'

import { Header } from '../src/components/Header'
import { Input } from '../src/components/Input'
import { Button } from '../src/components/Button'

export function Find() {
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')

  const toast = useToast()
  const { navigate } = useNavigation()

  async function handleJoinPool() {
    try {
      setIsLoading(true)
      if (!code.trim()) {
       return toast.show({
          title: 'Informe o Código',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post('/pools/join', { code })
      toast.show({
        title: 'Você Entrou no bolão com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      })
      navigate('pools')

    } catch (e) {
      console.log(e)
      setIsLoading(false)

      if (e.response?.data?.message === 'Pool not found.') {
        return toast.show({
          title: 'Bolão não encontrado!',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      if (e.response?.data?.message === 'You already join this pool.') {
        return toast.show({
          title: 'Você já está nesse Bolão',
          placement: 'top',
          bgColor: 'red.500'
        })
      }
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de {'\n'}
          seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
        />

        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  )
}

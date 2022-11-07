// Em alguns momentos precisamos recarregar informações como listagens sempre que uma tela da nossa aplicação estiver em foco, para conseguir realizar esse comportamento podemos utilizar um hook que vem de dentro do React chamador useCallback.
import { useCallback, useState } from 'react'
import { VStack, Icon, useToast, FlatList } from 'native-base'
import { Octicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native'

import { api } from '../src/services/api'

import { Button } from '../src/components/Button'
import { Header } from '../src/components/Header'
import { PoolCard, PoolCardProps } from '../src/components/PoolCard'
import { Loading } from '../src/components/Loading'
import { EmptyPoolList } from '../src/components/EmptyPoolList'

export function Pools() {
  const [isLoading, setIsLoading] = useState(true)
  const [pools, setPools] = useState<PoolCardProps[]>([])

  const { navigate } = useNavigation()
  const toast = useToast()

  async function fetchPools() {
    try {
      setIsLoading(true)
      const response = await api.get('/pools')
      console.log(response.data)
      setPools(response.data.pools)
    } catch (e) {
      console.log(e)
      toast.show({
        title: 'Não foi possível carregar os bolões',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // useFocusEffect sempre vai executar a nossa interface quando receber meu focus de novo, ou seja quando entrar na tela sempre vai recarregar. O useCallback() garante que esa função nao seja executada varias vezes, garantindo performance
  useFocusEffect(
    useCallback(() => {
      fetchPools()
    }, [])
  )

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={
            <Icon as={Octicons} name="search" size="md" color="black" />
          }
          onPress={() => navigate('find')}
        />
      </VStack>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>( 
            <PoolCard 
              data={item} 
              // Com o React Navigation conseguimos navegar entre telas na nossa aplicação e também repassar e recuperar parâmetros por essas rotas. Qual hook do React Navigation podemos utilizar para recuperar os parâmetros repassados entre rotas? useNavigation();
              onPress={() => navigate('details', { id: item.id })}
            />
          )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      )}
    </VStack>
  )
}

import { HStack, useToast, VStack } from 'native-base'
import { useState, useEffect } from 'react'
import { Share } from 'react-native'
import { useRoute } from '@react-navigation/native'

import { Header } from '../src/components/Header'
import { Loading } from '../src/components/Loading'
import { Guesses } from '../src/components/Guesses'
import { Option } from '../src/components/Option'
import { EmptyMyPoolList } from '../src/components/EmptyMyPoolList'
import { PoolCardProps } from '../src/components/PoolCard'
import { PoolHeader } from '../src/components/PoolHeader'

import { api } from '../src/services/api'


interface RouteParams {
  id: string
}

export function Details() {
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>(
    'guesses'
  )
  const [isLoading, setIsLoading] = useState(true)
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>(
    {} as PoolCardProps
  )

  const route = useRoute()
  const toast = useToast()
  const { id } = route.params as RouteParams

  async function fetchPoolDetails() {
    try {
      setIsLoading(true)

      const response = await api.get(`/pools/${id}`)
      setPoolDetails(response.data.pool)
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Não foi possível carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: `Olha o código do meu bolão: ${poolDetails.code}`
    })
  }

  useEffect(() => {
    fetchPoolDetails()
  }, [id])

  if (isLoading) {
    return <Loading />
  }
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header 
        title={poolDetails.title} 
        showBackButton 
        showShareButton 
        onShare={handleCodeShare}
      />
      {poolDetails._count?.Participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>

          <Guesses poolId={poolDetails.id} code={poolDetails.code} onShare={handleCodeShare}/>
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} onShare={handleCodeShare} />
      )}
    </VStack>
  )
}

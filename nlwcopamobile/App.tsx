// native-base = componentes universais para todo tipo de aplicação
import { NativeBaseProvider, StatusBar } from 'native-base'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold
} from '@expo-google-fonts/roboto'

import { SignIn } from './screens/Signin'
import { Loading } from './src/components/Loading'

import { THEME } from './src/styles/theme'
import { AuthContextProvider } from './src/contexts/AuthContext'
import { New } from './screens/New'

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold
  })

  return (
    // Esse NativeBaseProvider vai compartilhar com todo mundo que estiver dentro dele ou seja toda aplicação a gente consiga utilizar tudo aquilo que o native base tem a prover para nós e todo o thema colocado nele
    <NativeBaseProvider theme={THEME}>
      <AuthContextProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        {fontsLoaded ? <New /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  )
}

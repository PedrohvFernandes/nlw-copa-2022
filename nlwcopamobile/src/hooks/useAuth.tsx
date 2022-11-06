//Os contextos no React servem para compartilhar informações para todos os componentes que estão envolvidos pelo Provider desse contexto. Uma forma muito utilizada por é criar um hook para facilitar o compartilhamento desses dados entre os componentes.
import { useContext } from "react";

import {AuthContext, AuthContextDataProps} from '../contexts/AuthContext'

// Para a gente usar esse contexto, a gente precisa do useContext, so que pra ficar não repetido ele em varios lugares, então a gente cria esse hook, porque ai a gente usa o contexto esse useContext e quando a gente precisar usar nosso usar nosso contexto a gente chama a função useAuth que retorna qual é conteudo do nosso contexto, buscando o nosso contexto e essa info é compartilhada com toda nossa aplicação pelo App.tsx
export function useAuth(): AuthContextDataProps {
  const context = useContext(AuthContext)
  
  return context
}
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { definirToken, limparToken, obterToken } from '../api/client'
import type { Usuario } from '../tipos'

const CHAVE_USUARIO = 'tarefas.usuario'

type EstadoAuth = {
  usuario: Usuario | null
  token: string | null
  entrar: (token: string, usuario: Usuario) => void
  sair: () => void
}

const AuthContext = createContext<EstadoAuth | null>(null)

function lerUsuario(): Usuario | null {
  const raw = localStorage.getItem(CHAVE_USUARIO)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Usuario
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => obterToken())
  const [usuario, setUsuario] = useState<Usuario | null>(() => lerUsuario())

  const entrar = useCallback((novoToken: string, novoUsuario: Usuario) => {
    definirToken(novoToken)
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(novoUsuario))
    setToken(novoToken)
    setUsuario(novoUsuario)
  }, [])

  const sair = useCallback(() => {
    limparToken()
    localStorage.removeItem(CHAVE_USUARIO)
    setToken(null)
    setUsuario(null)
  }, [])

  const valor = useMemo(
    () => ({ usuario, token, entrar, sair }),
    [usuario, token, entrar, sair],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth(): EstadoAuth {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  }
  return ctx
}

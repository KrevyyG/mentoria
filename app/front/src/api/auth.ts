import { requisicao } from './client'
import type { Usuario } from '../tipos'

type RespostaLogin = {
  token: string
  usuario: Usuario
}

export function registrar(email: string, senha: string): Promise<Usuario> {
  return requisicao<Usuario>('/auth/registro', {
    metodo: 'POST',
    corpo: { email, senha },
  })
}

export function login(email: string, senha: string): Promise<RespostaLogin> {
  return requisicao<RespostaLogin>('/auth/login', {
    metodo: 'POST',
    corpo: { email, senha },
  })
}

export function logout(): Promise<void> {
  return requisicao<void>('/auth/logout', { metodo: 'POST' })
}

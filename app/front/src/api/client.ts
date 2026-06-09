import type { EnvelopeErro } from '../tipos'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

const CHAVE_TOKEN = 'tarefas.token'

export function obterToken(): string | null {
  return localStorage.getItem(CHAVE_TOKEN)
}

export function definirToken(token: string): void {
  localStorage.setItem(CHAVE_TOKEN, token)
}

export function limparToken(): void {
  localStorage.removeItem(CHAVE_TOKEN)
}

export class ErroApi extends Error {
  codigo: string
  status: number
  constructor(codigo: string, mensagem: string, status: number) {
    super(mensagem)
    this.codigo = codigo
    this.status = status
  }
}

type OpcoesRequisicao = {
  metodo?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  corpo?: unknown
  params?: Record<string, string | undefined>
}

export async function requisicao<T>(
  caminho: string,
  opcoes: OpcoesRequisicao = {},
): Promise<T> {
  const { metodo = 'GET', corpo, params } = opcoes

  const url = new URL(BASE_URL + caminho)
  if (params) {
    for (const [chave, valor] of Object.entries(params)) {
      if (valor !== undefined) url.searchParams.set(chave, valor)
    }
  }

  const headers: Record<string, string> = {}
  const token = obterToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (corpo !== undefined) headers['Content-Type'] = 'application/json'

  const resposta = await fetch(url.toString(), {
    method: metodo,
    headers,
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  })

  if (resposta.status === 401) {
    limparToken()
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
    throw new ErroApi('nao_autorizado', 'Sessão expirada', 401)
  }

  if (resposta.status === 204) {
    return undefined as T
  }

  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    const envelope = dados as EnvelopeErro | null
    const codigo = envelope?.erro?.codigo ?? 'erro'
    const mensagem = envelope?.erro?.mensagem ?? 'Erro inesperado'
    throw new ErroApi(codigo, mensagem, resposta.status)
  }

  return dados as T
}

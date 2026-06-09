export type Tarefa = {
  id: string
  titulo: string
  concluida: boolean
  categoria_id: string | null
  criado_em: string
}

export type Categoria = {
  id: string
  nome: string
  criado_em: string
}

export type Usuario = {
  id: string
  email: string
}

export type EnvelopeErro = {
  erro: {
    codigo: string
    mensagem: string
  }
}

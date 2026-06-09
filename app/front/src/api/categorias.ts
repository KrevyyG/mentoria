import { requisicao } from './client'
import type { Categoria } from '../tipos'

export function listarCategorias(): Promise<Categoria[]> {
  return requisicao<Categoria[]>('/categorias')
}

export function criarCategoria(nome: string): Promise<Categoria> {
  return requisicao<Categoria>('/categorias', {
    metodo: 'POST',
    corpo: { nome },
  })
}

export function excluirCategoria(id: string): Promise<void> {
  return requisicao<void>(`/categorias/${id}`, { metodo: 'DELETE' })
}

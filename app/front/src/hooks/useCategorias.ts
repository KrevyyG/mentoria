import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  criarCategoria,
  excluirCategoria,
  listarCategorias,
} from '../api/categorias'
import type { Categoria } from '../tipos'

const CHAVE = ['categorias'] as const

export function useCategorias() {
  return useQuery<Categoria[]>({
    queryKey: CHAVE,
    queryFn: listarCategorias,
  })
}

export function useCriarCategoria() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (nome: string) => criarCategoria(nome),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: CHAVE })
    },
  })
}

export function useExcluirCategoria() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => excluirCategoria(id),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: CHAVE })
      // tarefas que usavam essa categoria ficaram "sem categoria" no back
      cliente.invalidateQueries({ queryKey: ['tarefas'] })
    },
  })
}

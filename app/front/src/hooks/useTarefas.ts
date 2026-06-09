import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  atualizarTarefa,
  criarTarefa,
  excluirTarefa,
  FILTROS_PADRAO,
  listarTarefas,
  type EntradaCriarTarefa,
  type FiltrosTarefas,
} from '../api/tarefas'
import type { Tarefa } from '../tipos'

const CHAVE = ['tarefas'] as const

export function useTarefas(filtros: FiltrosTarefas = FILTROS_PADRAO) {
  return useQuery<Tarefa[]>({
    queryKey: ['tarefas', filtros],
    queryFn: () => listarTarefas(filtros),
  })
}

export function useCriarTarefa() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (entrada: EntradaCriarTarefa) => criarTarefa(entrada),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: CHAVE })
    },
  })
}

export function useAtualizarTarefa() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: ({ id, concluida }: { id: string; concluida: boolean }) =>
      atualizarTarefa(id, concluida),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: CHAVE })
    },
  })
}

export function useExcluirTarefa() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => excluirTarefa(id),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: CHAVE })
    },
  })
}

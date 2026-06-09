import { requisicao } from './client'
import type { Tarefa } from '../tipos'

export type FiltroSituacao = 'todas' | 'pendentes' | 'concluidas'
export type FiltroCategoria =
  | { tipo: 'todas' }
  | { tipo: 'sem_categoria' }
  | { tipo: 'categoria'; id: string }

export type FiltrosTarefas = {
  situacao: FiltroSituacao
  categoria: FiltroCategoria
}

export const FILTROS_PADRAO: FiltrosTarefas = {
  situacao: 'todas',
  categoria: { tipo: 'todas' },
}

export function listarTarefas(
  filtros: FiltrosTarefas = FILTROS_PADRAO,
): Promise<Tarefa[]> {
  const params: Record<string, string | undefined> = {}
  if (filtros.situacao === 'concluidas') params.concluida = 'true'
  if (filtros.situacao === 'pendentes') params.concluida = 'false'
  if (filtros.categoria.tipo === 'sem_categoria')
    params.sem_categoria = 'true'
  if (filtros.categoria.tipo === 'categoria')
    params.categoria_id = filtros.categoria.id

  return requisicao<Tarefa[]>('/tarefas', { params })
}

export type EntradaCriarTarefa = {
  titulo: string
  categoria_id?: string | null
}

export function criarTarefa(entrada: EntradaCriarTarefa): Promise<Tarefa> {
  return requisicao<Tarefa>('/tarefas', { metodo: 'POST', corpo: entrada })
}

export function atualizarTarefa(
  id: string,
  concluida: boolean,
): Promise<Tarefa> {
  return requisicao<Tarefa>(`/tarefas/${id}`, {
    metodo: 'PATCH',
    corpo: { concluida },
  })
}

export function excluirTarefa(id: string): Promise<void> {
  return requisicao<void>(`/tarefas/${id}`, { metodo: 'DELETE' })
}

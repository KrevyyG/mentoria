import type { Tarefa } from '../tipos'
import {
  useAtualizarTarefa,
  useExcluirTarefa,
} from '../hooks/useTarefas'
import { useCategorias } from '../hooks/useCategorias'

export function ItemTarefa({ tarefa }: { tarefa: Tarefa }) {
  const atualizar = useAtualizarTarefa()
  const excluir = useExcluirTarefa()
  const categorias = useCategorias()
  const nomeCategoria =
    tarefa.categoria_id
      ? categorias.data?.find((c) => c.id === tarefa.categoria_id)?.nome
      : null

  function aoTrocarConclusao() {
    atualizar.mutate({ id: tarefa.id, concluida: !tarefa.concluida })
  }

  function aoExcluir() {
    if (confirm(`Excluir a tarefa "${tarefa.titulo}"?`)) {
      excluir.mutate(tarefa.id)
    }
  }

  return (
    <li
      style={{
        listStyle: 'none',
        padding: '12px 16px',
        border: '1px solid var(--cor-borda)',
        borderRadius: 8,
        background: 'var(--cor-superficie)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <input
        type="checkbox"
        checked={tarefa.concluida}
        onChange={aoTrocarConclusao}
        disabled={atualizar.isPending}
        aria-label={
          tarefa.concluida
            ? `Desmarcar tarefa ${tarefa.titulo}`
            : `Concluir tarefa ${tarefa.titulo}`
        }
      />
      <span
        style={{
          flex: 1,
          textDecoration: tarefa.concluida ? 'line-through' : 'none',
          color: tarefa.concluida
            ? 'var(--cor-texto-suave)'
            : 'var(--cor-texto)',
        }}
      >
        {tarefa.titulo}
      </span>
      {nomeCategoria && (
        <span
          style={{
            fontSize: 12,
            padding: '2px 8px',
            borderRadius: 999,
            background: 'var(--cor-borda)',
            color: 'var(--cor-texto-suave)',
          }}
        >
          {nomeCategoria}
        </span>
      )}
      <button
        type="button"
        onClick={aoExcluir}
        disabled={excluir.isPending}
        aria-label={`Excluir tarefa ${tarefa.titulo}`}
        style={{
          background: 'transparent',
          border: '1px solid var(--cor-borda)',
          color: 'var(--cor-perigo)',
          borderRadius: 6,
          padding: '4px 10px',
          cursor: 'pointer',
        }}
      >
        Excluir
      </button>
    </li>
  )
}

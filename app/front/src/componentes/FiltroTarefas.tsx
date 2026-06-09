import { useCategorias } from '../hooks/useCategorias'
import type {
  FiltroCategoria,
  FiltroSituacao,
  FiltrosTarefas,
} from '../api/tarefas'

type Props = {
  valor: FiltrosTarefas
  aoMudar: (novo: FiltrosTarefas) => void
}

const CHAVE_TODAS = 'todas'
const CHAVE_SEM = 'sem_categoria'

export function FiltroTarefas({ valor, aoMudar }: Props) {
  const categorias = useCategorias()

  function trocarSituacao(situacao: FiltroSituacao) {
    aoMudar({ ...valor, situacao })
  }

  function trocarCategoria(chave: string) {
    let categoria: FiltroCategoria
    if (chave === CHAVE_TODAS) categoria = { tipo: 'todas' }
    else if (chave === CHAVE_SEM) categoria = { tipo: 'sem_categoria' }
    else categoria = { tipo: 'categoria', id: chave }
    aoMudar({ ...valor, categoria })
  }

  const valorCategoria =
    valor.categoria.tipo === 'todas'
      ? CHAVE_TODAS
      : valor.categoria.tipo === 'sem_categoria'
        ? CHAVE_SEM
        : valor.categoria.id

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', gap: 6 }}>
        {(['todas', 'pendentes', 'concluidas'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => trocarSituacao(s)}
            aria-pressed={valor.situacao === s}
            style={{
              padding: '4px 12px',
              borderRadius: 999,
              border: '1px solid var(--cor-borda)',
              background:
                valor.situacao === s
                  ? 'var(--cor-destaque)'
                  : 'transparent',
              color:
                valor.situacao === s
                  ? 'var(--cor-texto)'
                  : 'var(--cor-texto-suave)',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ color: 'var(--cor-texto-suave)' }}>Categoria:</span>
        <select
          value={valorCategoria}
          onChange={(e) => trocarCategoria(e.target.value)}
        >
          <option value={CHAVE_TODAS}>Todas</option>
          <option value={CHAVE_SEM}>Sem categoria</option>
          {categorias.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

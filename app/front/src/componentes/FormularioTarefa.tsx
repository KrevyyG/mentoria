import { useState, type FormEvent } from 'react'
import { useCriarTarefa } from '../hooks/useTarefas'
import { useCategorias } from '../hooks/useCategorias'
import { ErroApi } from '../api/client'

const SEM_CATEGORIA = '__sem__'

export function FormularioTarefa() {
  const [titulo, setTitulo] = useState('')
  const [categoriaId, setCategoriaId] = useState<string>(SEM_CATEGORIA)
  const mutar = useCriarTarefa()
  const categorias = useCategorias()

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const limpo = titulo.trim()
    if (!limpo) return
    mutar.mutate(
      {
        titulo: limpo,
        categoria_id: categoriaId === SEM_CATEGORIA ? null : categoriaId,
      },
      {
        onSuccess: () => {
          setTitulo('')
          setCategoriaId(SEM_CATEGORIA)
        },
      },
    )
  }

  const mensagemErro =
    mutar.error instanceof ErroApi ? mutar.error.message : null

  return (
    <form
      onSubmit={aoEnviar}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: 'var(--cor-superficie)',
        border: '1px solid var(--cor-borda)',
        padding: 16,
        borderRadius: 12,
      }}
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Nova tarefa..."
          aria-label="Título da tarefa"
          style={{ flex: '1 1 200px' }}
        />
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          aria-label="Categoria"
        >
          <option value={SEM_CATEGORIA}>Sem categoria</option>
          {categorias.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        <button type="submit" disabled={mutar.isPending}>
          {mutar.isPending ? 'Adicionando...' : 'Adicionar'}
        </button>
      </div>
      {mensagemErro && (
        <p style={{ color: 'var(--cor-perigo)', margin: 0 }}>{mensagemErro}</p>
      )}
    </form>
  )
}

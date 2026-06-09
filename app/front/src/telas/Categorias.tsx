import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { logout as logoutApi } from '../api/auth'
import {
  useCategorias,
  useCriarCategoria,
  useExcluirCategoria,
} from '../hooks/useCategorias'
import { ErroApi } from '../api/client'
import { EstadoVazio } from '../componentes/EstadoVazio'

export default function Categorias() {
  const { usuario, sair } = useAuth()
  const navegar = useNavigate()
  const consulta = useCategorias()
  const criar = useCriarCategoria()
  const excluir = useExcluirCategoria()
  const [nome, setNome] = useState('')

  async function aoSair() {
    try {
      await logoutApi()
    } catch {
      // back stateless
    }
    sair()
    navegar('/login', { replace: true })
  }

  function aoCriar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const limpo = nome.trim()
    if (!limpo) return
    criar.mutate(limpo, {
      onSuccess: () => setNome(''),
    })
  }

  function aoExcluir(id: string, nomeCat: string) {
    if (
      confirm(
        `Excluir a categoria "${nomeCat}"? As tarefas que a usavam ficarão sem categoria.`,
      )
    ) {
      excluir.mutate(id)
    }
  }

  const erroLista =
    consulta.error instanceof ErroApi ? consulta.error.message : null
  const erroCriar =
    criar.error instanceof ErroApi ? criar.error.message : null

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
          <h1 style={{ margin: 0 }}>Categorias</h1>
          <Link to="/">← Tarefas</Link>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: 'var(--cor-texto-suave)' }}>
            {usuario?.email}
          </span>
          <button type="button" onClick={aoSair}>
            Sair
          </button>
        </div>
      </header>

      <section style={{ marginBottom: 24 }}>
        <form
          onSubmit={aoCriar}
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
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nova categoria..."
              aria-label="Nome da categoria"
              style={{ flex: 1 }}
            />
            <button type="submit" disabled={criar.isPending}>
              {criar.isPending ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
          {erroCriar && (
            <p style={{ color: 'var(--cor-perigo)', margin: 0 }}>{erroCriar}</p>
          )}
        </form>
      </section>

      <section>
        {consulta.isLoading && (
          <p style={{ color: 'var(--cor-texto-suave)' }}>Carregando...</p>
        )}
        {erroLista && (
          <p style={{ color: 'var(--cor-perigo)' }}>{erroLista}</p>
        )}
        {consulta.data && consulta.data.length === 0 && (
          <EstadoVazio
            titulo="Nenhuma categoria por aqui"
            descricao="Crie uma categoria para começar a organizar suas tarefas."
          />
        )}
        {consulta.data && consulta.data.length > 0 && (
          <ul
            style={{
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {consulta.data.map((c) => (
              <li
                key={c.id}
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
                <span style={{ flex: 1 }}>{c.nome}</span>
                <button
                  type="button"
                  onClick={() => aoExcluir(c.id, c.nome)}
                  disabled={excluir.isPending}
                  aria-label={`Excluir categoria ${c.nome}`}
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
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

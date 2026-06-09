import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { logout as logoutApi } from '../api/auth'
import { useTarefas } from '../hooks/useTarefas'
import { ErroApi } from '../api/client'
import { FormularioTarefa } from '../componentes/FormularioTarefa'
import { ItemTarefa } from '../componentes/ItemTarefa'
import { EstadoVazio } from '../componentes/EstadoVazio'
import { FiltroTarefas } from '../componentes/FiltroTarefas'
import { FILTROS_PADRAO, type FiltrosTarefas } from '../api/tarefas'

function temFiltroAtivo(f: FiltrosTarefas) {
  return f.situacao !== 'todas' || f.categoria.tipo !== 'todas'
}

export default function Tarefas() {
  const { usuario, sair } = useAuth()
  const navegar = useNavigate()
  const [filtros, setFiltros] = useState<FiltrosTarefas>(FILTROS_PADRAO)
  const consulta = useTarefas(filtros)

  async function aoSair() {
    try {
      await logoutApi()
    } catch {
      // sem estado no servidor; basta esquecer o token localmente
    }
    sair()
    navegar('/login', { replace: true })
  }

  const mensagemErro =
    consulta.error instanceof ErroApi ? consulta.error.message : null

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
          <h1 style={{ margin: 0 }}>Tarefas</h1>
          <Link to="/categorias">Categorias →</Link>
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
        <FormularioTarefa />
      </section>

      <section>
        <FiltroTarefas valor={filtros} aoMudar={setFiltros} />

        {consulta.isLoading && (
          <p style={{ color: 'var(--cor-texto-suave)' }}>Carregando...</p>
        )}
        {mensagemErro && (
          <p style={{ color: 'var(--cor-perigo)' }}>{mensagemErro}</p>
        )}
        {consulta.data &&
          consulta.data.length === 0 &&
          (temFiltroAtivo(filtros) ? (
            <EstadoVazio
              titulo="Nenhuma tarefa para esse filtro"
              descricao="Ajuste a situação ou a categoria para ver outros itens."
            />
          ) : (
            <EstadoVazio
              titulo="Nenhuma tarefa por aqui"
              descricao="Adicione a primeira tarefa no formulário acima."
            />
          ))}
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
            {consulta.data.map((t) => (
              <ItemTarefa key={t.id} tarefa={t} />
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

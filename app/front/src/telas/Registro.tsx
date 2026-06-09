import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { registrar } from '../api/auth'
import { ErroApi } from '../api/client'

export default function Registro() {
  const navegar = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const mutar = useMutation({
    mutationFn: () => registrar(email, senha),
    onSuccess: () => {
      navegar('/login', { replace: true })
    },
  })

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    mutar.mutate()
  }

  const mensagemErro =
    mutar.error instanceof ErroApi ? mutar.error.message : null

  return (
    <main style={estiloPagina}>
      <form onSubmit={aoEnviar} style={estiloFormulario}>
        <h1>Criar conta</h1>
        <label style={estiloCampo}>
          <span>E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label style={estiloCampo}>
          <span>Senha</span>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>
        {mensagemErro && <p style={estiloErro}>{mensagemErro}</p>}
        <button type="submit" disabled={mutar.isPending}>
          {mutar.isPending ? 'Criando...' : 'Criar conta'}
        </button>
        <p>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </main>
  )
}

const estiloPagina: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: '24px',
}

const estiloFormulario: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
  maxWidth: '360px',
  background: 'var(--cor-superficie)',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid var(--cor-borda)',
}

const estiloCampo: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const estiloErro: React.CSSProperties = {
  color: 'var(--cor-perigo)',
  margin: 0,
}

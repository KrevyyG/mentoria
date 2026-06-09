import type { ReactNode } from 'react'

type Props = {
  titulo: string
  descricao?: ReactNode
}

export function EstadoVazio({ titulo, descricao }: Props) {
  return (
    <div
      style={{
        border: '1px dashed var(--cor-borda)',
        borderRadius: 12,
        padding: '32px 24px',
        textAlign: 'center',
        background: 'var(--cor-superficie)',
      }}
    >
      <p style={{ margin: 0, fontWeight: 600 }}>{titulo}</p>
      {descricao && (
        <p style={{ marginTop: 8, color: 'var(--cor-texto-suave)' }}>
          {descricao}
        </p>
      )}
    </div>
  )
}

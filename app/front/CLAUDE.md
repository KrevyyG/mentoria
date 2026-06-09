# CLAUDE.md — Front

Guia rápido para trabalhar no front. Contexto geral está em
`../CLAUDE.md`. Verdade do projeto está em `../specs/`.

## Antes de codar

- Endpoint a consumir → conferir `../specs/03-contrato-api.md`
- Tela ou fluxo → ler `../specs/05-design-front.md`
- HU/RN → `../specs/01-requisitos.md`

## Estado do servidor vs estado de interface

Distinção central, a regra mais importante do front:

- **Servidor** (lista de tarefas, categorias): vem da API, pode ficar
  velha, precisa recarregar após criar/alterar/excluir. **TanStack Query**.
  - Ler com `useQuery({ queryKey, queryFn })`
  - Alterar com `useMutation({ mutationFn, onSuccess: invalidate })`
- **Interface** (filtro selecionado, texto digitado, diálogo aberto):
  vive só no navegador. **useState** local na tela ou componente.

Não misturar. Não copiar dados do servidor para `useState`.

## Chaves de query (já em uso)

- `['categorias']`
- `['tarefas', filtros]`

Mutations invalidam a chave-pai. `useExcluirCategoria` invalida AMBAS
`['categorias']` e `['tarefas']` porque o back faz SetNull em tarefas
relacionadas (RN-07).

## Cliente HTTP único

`src/api/client.ts` é o único lugar que chama `fetch`. Concentra:

- base URL (`VITE_API_URL`)
- header `Authorization: Bearer <token>` se houver token
- tratamento de 401 (limpa token, redireciona para /login)
- leitura do envelope `{ erro: { codigo, mensagem } }` e
  `throw new ErroApi(codigo, mensagem, status)`

Telas e hooks chamam `requisicao<T>(caminho, opcoes)`. Não chamar `fetch`
em outro lugar.

## Erros

`error instanceof ErroApi` em mutations/queries; mostrar
`error.message`. Padrão nas telas:

    const mensagemErro =
      mutar.error instanceof ErroApi ? mutar.error.message : null

`mensagem` já vem em PT-BR do back.

## Autenticação

- `AuthProvider` em `App.tsx` envolve tudo
- `useAuth()` em qualquer componente: `{ usuario, token, entrar, sair }`
- `entrar(token, usuario)` guarda no localStorage e no estado
- `sair()` limpa tudo
- `<RotaProtegida>` envolve rotas que exigem login

Logout chama `POST /api/auth/logout` (back stateless; só simétrico) e
depois descarta o token localmente.

## Tipos

`src/tipos/index.ts` espelha o contrato (snake_case nos campos:
`categoria_id`, `criado_em`). Quando o contrato mudar, ajustar aqui.

## Identidade visual

Tokens CSS em `src/estilos/tokens.css`:

    --cor-fundo, --cor-texto, --cor-destaque, --cor-destaque-forte,
    --cor-superficie, --cor-texto-suave, --cor-borda, --cor-perigo

Componentes usam `var(--...)`, nunca hex direto. Dark-first.

## Convenções

- TypeScript sem `;` (Prettier `semi: false`)
- Nomes em PT-BR no domínio (`useTarefas`, `FormularioTarefa`,
  `aoEnviar`)
- Pasta `componentes/` para reuso visual; `telas/` para rotas
- Inputs sempre com `aria-label` quando não houver `<label>` visível
- Ações destrutivas pedem `confirm()` leve antes de mutar

## Comandos úteis

    npm run dev                 vite dev
    npm run build               tsc -b && vite build
    npx tsc -b --noEmit         type-check sem build

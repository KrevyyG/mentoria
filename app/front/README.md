# QAlificado - To Do — Front

Aplicação React do app QAlificado - To Do. Consome a API NestJS do `../back`.

A verdade do projeto vive em `../specs/`. Este README cobre só o que é
preciso para rodar e navegar o código.

## Stack

- React 19 + Vite + TypeScript
- React Router (navegação)
- TanStack Query (estado do servidor)
- fetch direto (cliente HTTP tipado em `src/api/client.ts`)
- Token JWT no localStorage

## Rodar local

Pré-requisitos: Node 20+ e o back rodando em http://localhost:3000.

    cp .env.example .env
    # VITE_API_URL padrão já aponta para o back local
    npm install
    npm run dev

App em http://localhost:5173.

## Estrutura

    src/
      main.tsx                envolve App em QueryClientProvider e tokens.css
      App.tsx                 rotas; envolve com AuthProvider e RotaProtegida
      api/
        client.ts             base URL, Bearer, tratamento de 401, ErroApi
        auth.ts               registrar, login, logout
        tarefas.ts            listar/criar/atualizar/excluir + tipos de filtro
        categorias.ts         listar/criar/excluir
      hooks/
        useTarefas.ts         useTarefas(filtros), useCriarTarefa, etc.
        useCategorias.ts      useCategorias, useCriarCategoria, useExcluirCategoria
      tipos/
        index.ts              Tarefa, Categoria, Usuario, EnvelopeErro
      auth/
        AuthContext.tsx       useAuth(): { usuario, token, entrar, sair }
        RotaProtegida.tsx     redireciona p/ /login sem token
      telas/
        Login.tsx, Registro.tsx, Tarefas.tsx, Categorias.tsx
      componentes/
        FormularioTarefa.tsx, ItemTarefa.tsx,
        FiltroTarefas.tsx, EstadoVazio.tsx
      estilos/
        tokens.css            variáveis CSS da identidade

## Convenções

- TypeScript em tudo, sem ponto e vírgula (Prettier `semi: false`)
- Domínio em português: `Tarefa`, `Categoria`, `Usuario`
- Estado do servidor → TanStack Query (chaves `['tarefas', filtros]`,
  `['categorias']`); mutations invalidam a chave-pai
- Estado de interface (filtro, input, diálogo) → `useState` local
- Cliente HTTP único (`api/client.ts`); telas não chamam `fetch`
- Cores via tokens CSS (`var(--cor-destaque)`, etc); nunca hex direto

## Scripts

    npm run dev      vite dev (HMR)
    npm run build    tsc -b && vite build
    npm run preview  serve a build de produção
    npm run lint     eslint

## Variáveis de ambiente

| nome         | obrigatória | descrição                                 |
|--------------|-------------|-------------------------------------------|
| VITE_API_URL | não         | base da API; default `http://localhost:3000/api` |

`.env` está no `.gitignore`. Há um `.env.example` para referência.

## Token e segurança

O token JWT é guardado em `localStorage`. Persiste entre F5; fica
acessível a scripts da página, então a mitigação é não permitir XSS
(React já escapa por padrão; não usar `dangerouslySetInnerHTML` com
conteúdo não confiável). Decisão explicada em `specs/05-design-front.md`
seção 9.

## Fora de escopo

Refresh tokens, recuperação de senha, edição de título de tarefa /
nome de categoria, datas/lembretes. Ver specs/05 e specs/01 seção 6.

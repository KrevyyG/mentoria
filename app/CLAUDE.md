# CLAUDE.md

Contexto fixo do projeto. Leia antes de qualquer tarefa.

## Visão geral

App de tarefas multiusuário, criado para estudo e mentoria. Cada usuário
acessa com sua conta e gerencia suas próprias tarefas e categorias.
Idioma do produto e do código de domínio: português do Brasil.

## Stack

Back-end:
- TypeScript + Node.js + NestJS
- Prisma (ORM)
- PostgreSQL hospedado no Supabase (somente como banco de dados)
- Autenticação própria: JWT (token Bearer), hash de senha com argon2

Front-end:
- React + Vite + TypeScript
- React Router (navegação)
- TanStack Query (estado do servidor)
- Token guardado no localStorage

## Estrutura do repositório

    specs/                 a verdade do projeto (ler antes de codar)
      01-requisitos.md
      02-modelo-dados.md
      03-contrato-api.md
      04-design-back.md
      05-design-front.md
      06-tarefas.md
    identidade-visual/     cores, tokens e logos
      identidade-visual.md
      (arquivos de logo e favicon)
    back/                  aplicação NestJS
    front/                 aplicação React + Vite

## Como rodar

Back:
- copiar .env (DATABASE_URL, DIRECT_URL, JWT_SECRET, JWT_EXPIRES_IN)
- npm install
- npx prisma migrate dev
- npm run start:dev

Front:
- copiar .env (VITE_API_URL apontando para o back)
- npm install
- npm run dev

## Convenções de código

- NÃO usar ponto e vírgula no fim das linhas (configurar Prettier com
  semi: false para impor isso automaticamente)
- TypeScript em todo o projeto
- Nomes de domínio em português: Usuario, Categoria, Tarefa
- Mensagens ao usuário em português
- Back em camadas: controller (HTTP) -> service (regras) -> Prisma (dados).
  Regra de negócio não fica no controller.
- Front: TanStack Query para estado do servidor; useState só para estado de
  interface (filtro, formulário, diálogo)

## Cores e logo

Nunca escrever hex direto nos componentes. Usar os tokens de
identidade-visual/identidade-visual.md (variáveis CSS como --cor-destaque).
Tema é dark-first: fundo #131313, texto #FFFFFF, destaque/laranja #E66A01.

## Como trabalhar as tarefas

Seguir specs/06-tarefas.md em fatias verticais: primeiro a Fase 0
(fundação), depois cada fatia de ponta a ponta (back + front), respeitando
a Verificação ao fim de cada uma antes de avançar.

## Decisões-chave (resumo; detalhes nas specs)

- IDs em UUID (não enumeráveis) — 02-modelo-dados
- Recurso de outro usuário responde 404, nunca 403 (não vaza existência);
  implementado pelo filtro where { id, usuarioId } — 03 e 04
- Envelope de erro único: { erro: { codigo, mensagem } } — 03
- Categoria da tarefa é opcional; excluir categoria deixa tarefas "sem
  categoria" (onDelete SetNull), sem apagá-las — 02, RN-06 e RN-07
- Supabase é só o banco; toda a autenticação vive no NestJS — 04

## Fora de escopo (por ora)

Deploy/hospedagem, refresh tokens, recuperação de senha, verificação de
e-mail, edição de título de tarefa e de nome de categoria, datas/lembretes.
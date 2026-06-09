# Plano de Execução — App de Tarefas

Estratégia: fatias verticais. Cada fatia entrega uma funcionalidade de
ponta a ponta (back + front), de modo que sempre exista algo funcionando.

## Como ler este arquivo

- Cada item é uma tarefa pequena e verificável
- [B] = back-end, [F] = front-end
- Referências (HU-xx, RN-xx) apontam para 01-requisitos.md; "03 seção X"
  e afins apontam para os respectivos documentos
- A Fase 0 é a fundação; ela não é uma feature, mas as fatias dependem dela
- Cada fatia termina com uma Verificação: o que precisa funcionar de ponta
  a ponta antes de seguir

## Fase 0 — Fundação

Back:
- [ ] [B] Criar projeto NestJS
- [ ] [B] Criar projeto no Supabase e copiar as connection strings
- [ ] [B] Adicionar Prisma; configurar datasource com DATABASE_URL (pooler,
      6543) e DIRECT_URL (direto, 5432) — 04 seção 9
- [ ] [B] Escrever schema.prisma: Usuario, Categoria, Tarefa — 02 / 04 seção 4
- [ ] [B] Rodar a primeira migration
- [ ] [B] Criar PrismaService compartilhado
- [ ] [B] Criar filtro global de exceções (envelope de erro) — 03 seção 2
- [ ] [B] Ativar pipe de validação global

Front:
- [ ] [F] Criar projeto Vite + React + TypeScript
- [ ] [F] Configurar React Router e a estrutura de pastas — 05 seção 2
- [ ] [F] Configurar QueryClientProvider (TanStack Query) — 05 seção 5
- [ ] [F] Criar api/client.ts: base URL (VITE_API_URL), header Bearer,
      tratamento de 401 — 05 seção 6
- [ ] [F] Definir os tipos Tarefa e Categoria — 05 seção 10

## Fatia 1 — Autenticação (HU-01, HU-02)

Primeira fatia porque tudo o mais depende de um usuário logado.

Back:
- [ ] [B] POST /api/auth/registro: validar, e-mail único (409), hash
      argon2, criar (201) — HU-01
- [ ] [B] POST /api/auth/login: verificar senha, emitir JWT, 401 em falha
      (mesma mensagem para e-mail inexistente) — HU-02
- [ ] [B] POST /api/auth/logout: 204 — HU-02
- [ ] [B] JWT strategy + guard que injeta o usuarioId na requisição — 04 seção 5

Front:
- [ ] [F] AuthContext, guardando o token no localStorage — 05 seção 9
- [ ] [F] Tela de Registro — HU-01
- [ ] [F] Tela de Login (guarda token, redireciona para /) — HU-02
- [ ] [F] RotaProtegida: sem token, redireciona para /login — 05 seção 7
- [ ] [F] Ação de Logout: descarta o token — HU-02

Verificação: criar conta, entrar, acessar uma rota protegida e sair.
Credenciais erradas mostram aviso e não entram.

## Fatia 2 — Criar e ver tarefas (HU-05 sem categoria, HU-06)

O ciclo central do app, já visível na tela.

Back:
- [ ] [B] POST /api/tarefas: título não vazio (400), cria com o usuarioId
      do token, categoria opcional — HU-05, RN-03, RN-06
- [ ] [B] GET /api/tarefas: lista apenas as do usuário (where usuarioId)
      — HU-06, RN-01

Front:
- [ ] [F] hooks/useTarefas: query ["tarefas"] + mutation de criar que
      invalida a query — 05 seção 5
- [ ] [F] Tela Tarefas: formulário de criação + lista — HU-05, HU-06
- [ ] [F] Componente EstadoVazio para lista sem itens — HU-06

Verificação: criar uma tarefa faz ela aparecer na lista; recarregar a
página mantém; lista vazia mostra mensagem; título em branco é barrado.

## Fatia 3 — Concluir e desmarcar (HU-07)

Back:
- [ ] [B] PATCH /api/tarefas/{id}: altera concluida; where { id, usuarioId },
      404 se for de outro usuário — HU-07, RN-01, 03 seção 7

Front:
- [ ] [F] Mutation de concluir/desmarcar; invalida ["tarefas"] — 05 seção 5
- [ ] [F] ItemTarefa com indicação visual de concluída — HU-07

Verificação: marcar e desmarcar reflete na lista; concluídas continuam
visíveis, indicadas como tal.

## Fatia 4 — Excluir tarefa (HU-09)

Back:
- [ ] [B] DELETE /api/tarefas/{id}: where { id, usuarioId }, 404 se de
      outro; 204 ao excluir — HU-09

Front:
- [ ] [F] Mutation de excluir; invalida ["tarefas"]
- [ ] [F] Ação de excluir no ItemTarefa — HU-09

Verificação: tarefa excluída some da lista.

## Fatia 5 — Categorias e categoria na tarefa (HU-03, HU-04, parte de HU-05)

Agora que existem tarefas, dá sentido organizá-las.

Back:
- [ ] [B] POST /api/categorias: nome não vazio (400), único por usuário
      (409) — HU-03, RN-04
- [ ] [B] GET /api/categorias: apenas as do usuário — HU-04, RN-01
- [ ] [B] DELETE /api/categorias/{id}: 204; tarefas viram sem categoria
      (onDelete SetNull); 404 se de outro — HU-04, RN-07
- [ ] [B] POST /api/tarefas passa a aceitar categoria_id (404 se o id não
      for uma categoria do usuário) — HU-05

Front:
- [ ] [F] hooks/useCategorias: query ["categorias"] + mutations
- [ ] [F] Tela Categorias: criar, listar, excluir — HU-03, HU-04
- [ ] [F] Seletor de categoria no FormularioTarefa — HU-05

Verificação: criar e excluir categoria; excluir categoria com tarefas as
deixa "sem categoria" (não apaga a tarefa); nome duplicado é barrado.

## Fatia 6 — Filtrar (HU-08)

Back:
- [ ] [B] GET /api/tarefas com filtros: ?categoria_id, ?sem_categoria,
      ?concluida — HU-08

Front:
- [ ] [F] FiltroCategorias (estado de interface) que muda a chave da query
      para ["tarefas", filtros] — 05 seções 4 e 5
- [ ] [F] Mensagem de vazio específica para filtro sem resultado — HU-08

Verificação: filtrar por categoria, por "sem categoria" e por situação;
filtro sem resultado mostra a mensagem de vazio.

## Cobertura das histórias

- HU-01, HU-02 → Fatia 1
- HU-05 → Fatias 2 (sem categoria) e 5 (com categoria)
- HU-06 → Fatia 2
- HU-07 → Fatia 3
- HU-09 → Fatia 4
- HU-03, HU-04 → Fatia 5
- HU-08 → Fatia 6

Todas as histórias de 01-requisitos.md estão cobertas.
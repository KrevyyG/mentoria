# Plano de Execução — QAlificado - To Do

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

## Convenção: documentação Swagger

Toda rota nova do back é documentada no Swagger no mesmo commit em que é
criada. Cada item [B] que cria um endpoint inclui, implicitamente:

- @ApiTags no controller (recurso)
- @ApiOperation com summary referenciando a HU
- @ApiResponse para cada status possível (sucesso com DTO; erro com
  RespostaErroDto)
- @ApiBearerAuth('jwt') quando a rota for protegida
- @ApiProperty nos campos dos DTOs de entrada e de resposta

Detalhes em 04-design-back.md seção 11. A UI fica em /api/docs.

## Fase 0 — Fundação

Back:
- [x] [B] Criar projeto NestJS
- [x] [B] Criar projeto no Supabase e copiar as connection strings
- [x] [B] Adicionar Prisma; configurar datasource com DATABASE_URL (pooler,
      6543) e DIRECT_URL (direto, 5432) — 04 seção 9
- [x] [B] Escrever schema.prisma: Usuario, Categoria, Tarefa — 02 / 04 seção 4
- [x] [B] Rodar a primeira migration
- [x] [B] Criar PrismaService compartilhado
- [x] [B] Criar filtro global de exceções (envelope de erro) — 03 seção 2
- [x] [B] Ativar pipe de validação global
- [x] [B] Configurar Swagger em /api/docs (DocumentBuilder + Bearer) — 04 seção 11
- [x] [B] DTO RespostaErroDto em common/swagger para reuso em @ApiResponse

Front:
- [x] [F] Criar projeto Vite + React + TypeScript
- [x] [F] Configurar React Router e a estrutura de pastas — 05 seção 2
- [x] [F] Configurar QueryClientProvider (TanStack Query) — 05 seção 5
- [x] [F] Criar api/client.ts: base URL (VITE_API_URL), header Bearer,
      tratamento de 401 — 05 seção 6
- [x] [F] Definir os tipos Tarefa e Categoria — 05 seção 10

## Fatia 1 — Autenticação (HU-01, HU-02)

Primeira fatia porque tudo o mais depende de um usuário logado.

Back:
- [x] [B] POST /api/auth/registro: validar, e-mail único (409), hash
      argon2, criar (201) — HU-01
- [x] [B] POST /api/auth/login: verificar senha, emitir JWT, 401 em falha
      (mesma mensagem para e-mail inexistente) — HU-02
- [x] [B] POST /api/auth/logout: 204 — HU-02
- [x] [B] JWT strategy + guard que injeta o usuarioId na requisição — 04 seção 5

Front:
- [x] [F] AuthContext, guardando o token no localStorage — 05 seção 9
- [x] [F] Tela de Registro — HU-01
- [x] [F] Tela de Login (guarda token, redireciona para /) — HU-02
- [x] [F] RotaProtegida: sem token, redireciona para /login — 05 seção 7
- [x] [F] Ação de Logout: descarta o token — HU-02

Verificação: criar conta, entrar, acessar uma rota protegida e sair.
Credenciais erradas mostram aviso e não entram.

## Fatia 2 — Criar e ver tarefas (HU-05 sem categoria, HU-06)

O ciclo central do app, já visível na tela.

Back:
- [x] [B] POST /api/tarefas: título não vazio (400), cria com o usuarioId
      do token, categoria opcional — HU-05, RN-03, RN-06
- [x] [B] GET /api/tarefas: lista apenas as do usuário (where usuarioId)
      — HU-06, RN-01

Front:
- [x] [F] hooks/useTarefas: query ["tarefas"] + mutation de criar que
      invalida a query — 05 seção 5
- [x] [F] Tela Tarefas: formulário de criação + lista — HU-05, HU-06
- [x] [F] Componente EstadoVazio para lista sem itens — HU-06

Verificação: criar uma tarefa faz ela aparecer na lista; recarregar a
página mantém; lista vazia mostra mensagem; título em branco é barrado.

## Fatia 3 — Concluir e desmarcar (HU-07)

Back:
- [x] [B] PATCH /api/tarefas/{id}: altera concluida; where { id, usuarioId },
      404 se for de outro usuário — HU-07, RN-01, 03 seção 7

Front:
- [x] [F] Mutation de concluir/desmarcar; invalida ["tarefas"] — 05 seção 5
- [x] [F] ItemTarefa com indicação visual de concluída — HU-07

Verificação: marcar e desmarcar reflete na lista; concluídas continuam
visíveis, indicadas como tal.

## Fatia 4 — Excluir tarefa (HU-09)

Back:
- [x] [B] DELETE /api/tarefas/{id}: where { id, usuarioId }, 404 se de
      outro; 204 ao excluir — HU-09

Front:
- [x] [F] Mutation de excluir; invalida ["tarefas"]
- [x] [F] Ação de excluir no ItemTarefa — HU-09

Verificação: tarefa excluída some da lista.

## Fatia 5 — Categorias e categoria na tarefa (HU-03, HU-04, parte de HU-05)

Agora que existem tarefas, dá sentido organizá-las.

Back:
- [x] [B] POST /api/categorias: nome não vazio (400), único por usuário
      (409) — HU-03, RN-04
- [x] [B] GET /api/categorias: apenas as do usuário — HU-04, RN-01
- [x] [B] DELETE /api/categorias/{id}: 204; tarefas viram sem categoria
      (onDelete SetNull); 404 se de outro — HU-04, RN-07
- [x] [B] POST /api/tarefas passa a aceitar categoria_id (404 se o id não
      for uma categoria do usuário) — HU-05

Front:
- [x] [F] hooks/useCategorias: query ["categorias"] + mutations
- [x] [F] Tela Categorias: criar, listar, excluir — HU-03, HU-04
- [x] [F] Seletor de categoria no FormularioTarefa — HU-05

Verificação: criar e excluir categoria; excluir categoria com tarefas as
deixa "sem categoria" (não apaga a tarefa); nome duplicado é barrado.

## Fatia 6 — Filtrar (HU-08)

Back:
- [x] [B] GET /api/tarefas com filtros: ?categoria_id, ?sem_categoria,
      ?concluida — HU-08

Front:
- [x] [F] FiltroCategorias (estado de interface) que muda a chave da query
      para ["tarefas", filtros] — 05 seções 4 e 5
- [x] [F] Mensagem de vazio específica para filtro sem resultado — HU-08

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
# Design do Back-end — App de Tarefas

Este documento descreve COMO o servidor cumpre o contrato (03-contrato-api.md).
O quê e por quê já estão definidos; aqui entram as escolhas técnicas.

## 1. Stack

- Linguagem: TypeScript
- Runtime: Node.js
- Framework: NestJS
- ORM: Prisma
- Banco: PostgreSQL, hospedado no Supabase (somente como banco de dados)
- Autenticação: JWT (token Bearer), emitido e validado pelo próprio NestJS
- Hash de senha: argon2

## 2. Estrutura de pastas

    src/
      main.ts                  ponto de entrada
      app.module.ts            módulo raiz
      prisma/
        schema.prisma          modelo de dados (mapeia 02-modelo-dados.md)
        prisma.service.ts      cliente Prisma compartilhado
      common/
        filters/               filtro global de exceções (envelope de erro)
        decorators/            UsuarioAtual: extrai o usuário do token
      auth/
        auth.module.ts
        auth.controller.ts     registro, login, logout
        auth.service.ts        hash, verificação, emissão de JWT
        jwt.strategy.ts        valida o token Bearer
        jwt-auth.guard.ts      protege rotas
        dto/                   formatos de entrada validados
      categorias/
        categorias.module.ts
        categorias.controller.ts
        categorias.service.ts
        dto/
      tarefas/
        tarefas.module.ts
        tarefas.controller.ts
        tarefas.service.ts
        dto/

## 3. Camadas e responsabilidades

O fluxo de cada requisição percorre três camadas, cada uma com um papel:

- Controller: fala HTTP. Recebe a requisição, valida o corpo (via DTO) e
  devolve a resposta. Não contém regra de negócio.
- Service: o cérebro. Aplica as regras, decide o que pode e o que não pode,
  e é onde mora o isolamento por usuário.
- Prisma: o acesso ao banco. Executa as consultas que o service pede.

Essa separação é proposital: numa mentoria, é o que ensina o aluno a não
amontoar tudo no controller.

## 4. Modelo Prisma

O schema.prisma traduz o 02-modelo-dados.md diretamente:

    model Usuario {
      id         String      @id @default(uuid()) @db.Uuid
      email      String      @unique
      senhaHash  String      @map("senha_hash")
      criadoEm   DateTime    @default(now()) @map("criado_em")
      categorias Categoria[]
      tarefas    Tarefa[]
      @@map("usuario")
    }

    model Categoria {
      id        String   @id @default(uuid()) @db.Uuid
      nome      String
      usuarioId String   @map("usuario_id") @db.Uuid
      usuario   Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
      criadoEm  DateTime @default(now()) @map("criado_em")
      tarefas   Tarefa[]
      @@unique([usuarioId, nome])
      @@map("categoria")
    }

    model Tarefa {
      id          String     @id @default(uuid()) @db.Uuid
      titulo      String
      concluida   Boolean    @default(false)
      usuarioId   String     @map("usuario_id") @db.Uuid
      usuario     Usuario    @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
      categoriaId String?    @map("categoria_id") @db.Uuid
      categoria   Categoria? @relation(fields: [categoriaId], references: [id], onDelete: SetNull)
      criadoEm    DateTime   @default(now()) @map("criado_em")
      @@map("tarefa")
    }

Pontos a notar:
- @@unique([usuarioId, nome]) implementa a RN-04 (nome único por usuário)
- onDelete: SetNull na Tarefa implementa a RN-07: ao excluir a categoria,
  categoriaId das tarefas vira null automaticamente — a regra de negócio
  mora no schema
- categoriaId é opcional (String?), implementando a RN-06

## 5. Autenticação

### Registro (POST /api/auth/registro)
1. Valida e-mail e senha (DTO)
2. Verifica se o e-mail já existe; se sim → 409 (conflito)
3. Gera o hash da senha com argon2 (nunca guarda texto puro)
4. Cria o usuário e retorna 201

### Login (POST /api/auth/login)
1. Busca o usuário pelo e-mail
2. Confere a senha contra o hash com argon2
3. Se bater, assina um JWT com payload { sub: usuarioId } e devolve o token
4. Se não bater (ou e-mail inexistente) → 401, com a MESMA mensagem nos dois
   casos (não revela se o e-mail existe)

### Validação do token
Rotas protegidas usam um guard que valida o Bearer token e injeta o
usuarioId na requisição. Token ausente, expirado ou inválido → 401.

## 6. Isolamento por usuário (RN-01) e a regra do 404

Toda consulta no service inclui o usuarioId vindo do token. Para operações
sobre um item específico (buscar, alterar, excluir), o filtro é sempre:

    where: { id, usuarioId }

Sacada importante para a mentoria: essa única cláusula resolve DUAS coisas
ao mesmo tempo. Ela garante o isolamento (RN-01) e, de quebra, implementa a
decisão do 404 do contrato (seção 7 de 03-contrato-api.md): se o item
pertence a outro usuário, ele simplesmente "não é encontrado" por este
usuário, e o service lança um erro que vira 404 — sem nunca revelar que o
recurso existe.

## 7. Validação de entrada

Cada DTO declara suas regras (campo obrigatório, formato de e-mail, texto
não vazio). Uma falha de validação resulta sempre em 400 com
erro.codigo = validacao.

## 8. Tratamento de erros

Um filtro global de exceções traduz os erros para o envelope padrão do
contrato:

    { "erro": { "codigo": "...", "mensagem": "..." } }

Mapa de tradução:
- 400 → codigo "validacao"
- 401 → codigo "nao_autorizado"
- 404 → codigo "nao_encontrado"
- 409 → codigo "conflito"

Centralizar isso evita repetir formatação de erro em cada controller.

## 9. Conexão com o Supabase

O Supabase entra apenas como o Postgres. O Prisma usa duas URLs:

- DATABASE_URL: conexão via pooler (pgBouncer, porta 6543) com
  ?pgbouncer=true — usada pela aplicação em runtime
- DIRECT_URL: conexão direta (porta 5432) — usada pelas migrações
  (prisma migrate), que não funcionam bem através do pooler

No schema.prisma:

    datasource db {
      provider  = "postgresql"
      url       = env("DATABASE_URL")
      directUrl = env("DIRECT_URL")
    }

Nota operacional (importante): no plano gratuito do Supabase, o projeto é
pausado após 7 dias sem atividade no banco e leva ~30s para acordar no
próximo acesso. Para estudo isso é só um pequeno incômodo. Se incomodar,
um ping diário automático (ex.: GitHub Actions) mantém o projeto ativo.

## 10. Variáveis de ambiente

    DATABASE_URL     conexão via pooler (porta 6543)
    DIRECT_URL       conexão direta (porta 5432)
    JWT_SECRET       segredo para assinar os tokens
    JWT_EXPIRES_IN   validade do token (ex.: 7d)

Nenhum segredo vai para o código; tudo via arquivo .env (fora do controle
de versão).

## 11. Decisões registradas (revisáveis)

- DR-01: Hash com argon2 em vez de bcrypt. Argon2 é o algoritmo recomendado
  atualmente (resistente a ataque por hardware). bcrypt seria aceitável.
- DR-02: JWT sem estado, com um único token de acesso (sem refresh token).
  Mais simples para estudo. Refresh token fica como evolução futura.
- DR-03: Logout com JWT sem estado é, na prática, o cliente descartar o
  token. O endpoint /auth/logout existe por simetria do contrato e como
  gancho para uma futura lista de revogação (denylist), que seria o caminho
  para invalidar tokens no servidor de verdade.
- DR-04: UUID gerado pelo Prisma (@default(uuid())). O Postgres também
  poderia gerar via gen_random_uuid(); a escolha pelo Prisma mantém a
  geração visível no schema.

## 12. Fora de escopo (deste design)

- Deploy/hospedagem da API (estudo roda local)
- Refresh tokens e revogação de token
- Rate limiting e proteção contra brute force no login
- Verificação de e-mail
# QAlificado - To Do — Back

API NestJS do app QAlificado - To Do. Multiusuário, autenticação JWT
própria, Postgres no Supabase via Prisma.

A verdade do projeto vive em `../specs/`. Este README cobre só o que é
preciso para rodar e navegar o código.

## Stack

- TypeScript, Node.js, NestJS
- Prisma + PostgreSQL (Supabase)
- JWT Bearer (passport-jwt), argon2
- class-validator, class-transformer
- Swagger via @nestjs/swagger

## Rodar local

Pré-requisitos: Node 20+ e um projeto no Supabase.

    cp .env.example .env
    # preencher DATABASE_URL, DIRECT_URL, JWT_SECRET, JWT_EXPIRES_IN
    npm install
    npx prisma migrate dev
    npm run start:dev

- API: http://localhost:3000/api
- Swagger UI: http://localhost:3000/api/docs
- OpenAPI bruto: http://localhost:3000/api/docs-json

DATABASE_URL é a conexão via pooler (porta 6543, `?pgbouncer=true`) usada
em runtime. DIRECT_URL é a conexão direta (porta 5432) usada pelas
migrações. Ver `specs/04-design-back.md` seção 9.

## Estrutura

    src/
      main.ts                      bootstrap (prefixo /api, pipes, filtro, swagger)
      app.module.ts                módulo raiz
      prisma/
        prisma.service.ts
        prisma.module.ts           @Global
      common/
        decorators/
          usuario-atual.decorator.ts   @UsuarioAtual() → req.user.id
        filters/
          excecao-global.filter.ts     envelope { erro: { codigo, mensagem } }
        swagger/
          respostas-erro.ts            RespostaErroDto
      auth/                        registro / login / logout, JwtStrategy, guard
      categorias/                  POST/GET/DELETE com isolamento
      tarefas/                     POST/GET/PATCH/DELETE com filtros
    prisma/
      schema.prisma                Usuario, Categoria, Tarefa
      migrations/

## Convenções

- TypeScript em tudo, sem ponto e vírgula (Prettier `semi: false`)
- Camadas: controller (HTTP) → service (regras) → Prisma. Regra de negócio
  não fica no controller.
- Isolamento por usuário: toda consulta sobre item específico usa
  `where: { id, usuarioId }`; 0 linhas afetadas vira `NotFoundException`
  (404), nunca 403. Ver specs/03 §7 e specs/04 §6.
- DTOs declaram validação com class-validator; falha vira 400 codigo
  `validacao` no envelope global.
- Toda rota documentada no Swagger no mesmo commit em que é criada
  (@ApiTags, @ApiOperation, @ApiResponse, @ApiBearerAuth quando protegida,
  @ApiProperty nos DTOs). Ver specs/04 §11.

## Scripts

    npm run start:dev   watch mode
    npm run start       roda 1x
    npm run build       compila para dist/
    npm run start:prod  roda dist/main.js
    npm run lint        eslint --fix
    npm run format      prettier --write

## Variáveis de ambiente

| nome           | obrigatória | descrição                                |
|----------------|-------------|------------------------------------------|
| DATABASE_URL   | sim         | Postgres via pooler (porta 6543)         |
| DIRECT_URL     | sim         | Postgres direto (porta 5432, migrações)  |
| JWT_SECRET     | sim         | segredo para assinar tokens              |
| JWT_EXPIRES_IN | não         | validade do token (ex. `7d`); default 7d |
| PORT           | não         | porta HTTP; default 3000                 |

`.env` está no `.gitignore`. Há um `.env.example` para referência.

## Fora de escopo

Deploy, refresh tokens, recuperação de senha, verificação de e-mail,
edição de título de tarefa / nome de categoria, datas/lembretes, rate
limiting. Ver specs/04 §13.

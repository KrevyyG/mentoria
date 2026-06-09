# CLAUDE.md — Back

Guia rápido para trabalhar no back. Contexto geral está em
`../CLAUDE.md`. Verdade do projeto está em `../specs/`.

## Antes de codar

- Mudança em endpoint → ler `../specs/03-contrato-api.md`
- Mudança em modelo → ler `../specs/02-modelo-dados.md` e
  `../specs/04-design-back.md` seção 4
- Regra de negócio → conferir HU e RN em `../specs/01-requisitos.md`

## Camadas (sem atalho)

    Controller (HTTP)  →  Service (regras)  →  Prisma (dados)

- Controller só fala HTTP: recebe DTO, devolve resposta. Sem regra de
  negócio aqui.
- Service tem o cérebro: regras, isolamento por usuário, decisões de erro.
- Prisma só executa.

Não juntar tudo no controller, mesmo "porque é simples".

## Isolamento por usuário (RN-01)

Toda consulta sobre item específico:

    where: { id, usuarioId }

Para PATCH/DELETE com filtro composto, usar `updateMany` / `deleteMany`
e checar `count === 0` → `NotFoundException`. Isso atende dois requisitos
de uma vez:

- isolamento (não acha → 404)
- regra do 404 do contrato §7 (recurso de outro usuário não revela
  existência — NUNCA 403)

`@UsuarioAtual()` em `src/common/decorators/` injeta o `usuarioId` do
JWT direto na assinatura do controller.

## Erros (envelope único)

`ExcecaoGlobalFilter` traduz para `{ erro: { codigo, mensagem } }`. Para
gerar cada código, usar as exceções padrão do Nest:

| status | codigo          | exceção                  |
|--------|-----------------|--------------------------|
| 400    | validacao       | `BadRequestException` ou ValidationPipe |
| 401    | nao_autorizado  | `UnauthorizedException`  |
| 404    | nao_encontrado  | `NotFoundException`      |
| 409    | conflito        | `ConflictException`      |

Mensagens em português, voltadas ao usuário final.

## Validação de entrada

DTOs com class-validator (`@IsEmail`, `@IsUUID`, `@MinLength`, etc).
Para texto que não pode ser só espaços, combinar
`@Transform(({value}) => typeof value === 'string' ? value.trim() : value)`
com `@MinLength(1)`. Exemplo: `tarefas/dto/criar-tarefa.dto.ts`.

Para query string, ValidationPipe global converte com `transform: true`.
Para boolean em query (`?concluida=true`), usar `@Transform` que mapeia
"true"/"false" → boolean e devolve valor cru se for outro (faz
`@IsBoolean` rejeitar). Exemplo: `tarefas/dto/filtrar-tarefas.dto.ts`.

## Swagger (obrigatório)

Toda rota nova é documentada no Swagger no mesmo commit. Checklist:

- `@ApiTags('<recurso>')` no controller
- `@ApiOperation({ summary: '... (HU-xx)' })` no método
- `@ApiResponse({ status, type, description })` para cada status possível
  (sucesso com DTO de resposta; erro com `RespostaErroDto`)
- `@ApiBearerAuth('jwt')` se a rota usa `JwtAuthGuard`
- `@ApiProperty` em cada campo dos DTOs (entrada e resposta)
- `@ApiPropertyOptional` em campos opcionais (ex. filtros de query)

UI: http://localhost:3000/api/docs (autoriza Bearer e persiste no F5).

## Prisma e migrações

- Schema em `prisma/schema.prisma`
- `npx prisma migrate dev --name <descricao>` cria nova migration e
  aplica
- `npx prisma generate` regenera o client (também roda dentro do migrate)
- Pooler vs direct: `DATABASE_URL` (6543, `?pgbouncer=true`) em runtime,
  `DIRECT_URL` (5432) nas migrações

Onde a regra de negócio mora no schema:
- `@@unique([usuarioId, nome])` em Categoria → RN-04 (409 no service)
- `onDelete: SetNull` em Tarefa.categoria → RN-07 (DB cuida sozinho)
- `onDelete: Cascade` em Tarefa.usuario e Categoria.usuario

## Convenções

- TypeScript sem `;` (Prettier `semi: false`)
- Nomes de domínio em PT-BR (`Usuario`, `Categoria`, `Tarefa`)
- Mensagens ao usuário em PT-BR
- Resposta da API usa snake_case nos campos (`categoria_id`,
  `criado_em`); Prisma fica em camelCase internamente — converter no
  service (`paraDto`)

## Comandos úteis

    npm run start:dev          watch mode
    npx prisma studio          UI do banco
    npx tsc -p tsconfig.build.json --noEmit   type-check sem build

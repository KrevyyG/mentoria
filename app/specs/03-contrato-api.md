# Contrato de API — App de Tarefas

## 1. Convenções gerais

- Base de todas as rotas: /api
- Corpo de requisição e resposta sempre em JSON
- Datas no formato ISO 8601 em UTC
- Rotas protegidas exigem o header Authorization: Bearer <token>.
  Sem ele, expirado ou inválido → 401
- Toda operação é isolada pelo usuário autenticado (RN-01): o back nunca
  retorna nem altera dado de outro usuário

## 2. Formato padrão de erro

Toda resposta de erro segue o mesmo envelope, em qualquer rota:

  {
    "erro": {
      "codigo": "validacao",
      "mensagem": "O título não pode ser vazio"
    }
  }

- codigo: identificador estável, pensado para o front tratar (não muda
  com tradução). Ex.: validacao, nao_autorizado, nao_encontrado, conflito
- mensagem: texto legível, pode ser exibido ao usuário

## 3. Objetos de resposta

Tarefa:
  { "id": "uuid", "titulo": "Comprar pão", "concluida": false,
    "categoria_id": "uuid ou null", "criado_em": "2026-06-08T12:00:00Z" }

Categoria:
  { "id": "uuid", "nome": "Trabalho", "criado_em": "2026-06-08T12:00:00Z" }

## 4. Autenticação

### POST /api/auth/registro            (HU-01)
Cria uma conta. (Não autentica automaticamente; o login é um passo à parte.)
Requisição:  { "email": "a@b.com", "senha": "..." }
- 201: conta criada (retorna { "id": "uuid", "email": "a@b.com" })
- 400: e-mail inválido ou senha em branco (erro.codigo = validacao)
- 409: e-mail já cadastrado (erro.codigo = conflito)

### POST /api/auth/login               (HU-02)
Autentica o usuário e devolve o token de acesso.
Requisição:  { "email": "a@b.com", "senha": "..." }
- 200: autenticado. Resposta:
    {
      "token": "<token de acesso>",
      "usuario": { "id": "uuid", "email": "a@b.com" }
    }
  O front guarda o token e o envia em Authorization: Bearer <token>
  nas próximas chamadas.
- 401: credenciais inválidas (erro.codigo = nao_autorizado)

### POST /api/auth/logout              (HU-02)
Encerra a sessão atual.
- 204: sessão encerrada

## 5. Categorias

### POST /api/categorias               (HU-03)
Requisição:  { "nome": "Trabalho" }
- 201: categoria criada (retorna o objeto Categoria)
- 400: nome em branco (validacao)
- 409: já existe categoria com esse nome para o usuário (conflito, RN-04)

### GET /api/categorias                (HU-04)
- 200: lista das categorias do usuário (array de Categoria)

### DELETE /api/categorias/{id}        (HU-04)
- 204: excluída. As tarefas que a usavam passam a ter categoria_id = null
  (RN-07). As tarefas NÃO são removidas.
- 404: categoria não existe OU não pertence ao usuário (ver seção 7)

## 6. Tarefas

### POST /api/tarefas                  (HU-05)
Requisição:  { "titulo": "Comprar pão", "categoria_id": "uuid ou null" }
- categoria_id é opcional; ausente ou null = tarefa sem categoria (RN-06)
- 201: tarefa criada (retorna o objeto Tarefa)
- 400: título em branco (validacao)
- 404: categoria_id informado não existe OU não é do usuário (ver seção 7)

### GET /api/tarefas                   (HU-06, HU-08)
Filtros via query string (todos opcionais, combináveis):
- ?concluida=true|false       → filtra pela situação
- ?categoria_id={uuid}        → tarefas de uma categoria
- ?sem_categoria=true         → tarefas sem categoria
- 200: lista das tarefas do usuário (array de Tarefa, eventualmente vazio)

Observação: categoria_id e sem_categoria não são usados juntos.

### PATCH /api/tarefas/{id}            (HU-07)
Marca ou desmarca a conclusão.
Requisição:  { "concluida": true }
- 200: atualizada (retorna o objeto Tarefa)
- 404: tarefa não existe OU não é do usuário (ver seção 7)

### DELETE /api/tarefas/{id}           (HU-09)
- 204: excluída
- 404: tarefa não existe OU não é do usuário (ver seção 7)

## 7. Decisão: 404 para recurso de outro usuário

Quando o usuário pede um recurso que existe, mas pertence a OUTRA pessoa,
a API responde 404 (não encontrado), e NÃO 403 (proibido).

Por quê: um 403 confirmaria que aquele id existe, vazando informação para
quem está sondando. O 404 não revela nada — o recurso é, para este usuário,
indistinguível de algo que nunca existiu. Combinado com os ids em UUID
(não enumeráveis), forma uma defesa em camadas.

IMPORTANTE: este 404 é intencional. Testes não devem tratá-lo como bug.

## 8. Decisão: autenticação por token Bearer

O login devolve um token que o front envia no header Authorization a cada
chamada. O servidor não guarda estado de sessão.

Por quê: simples de consumir por qualquer cliente (web ou mobile) e mantém
o back sem estado. Cuidado de segurança a observar no design do front: o
local onde o token é guardado importa (armazenamento exposto a scripts
aumenta o risco de roubo via XSS). O tratamento concreto fica no
05-design-front.md.
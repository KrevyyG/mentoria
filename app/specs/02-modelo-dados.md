# Modelo de Dados — QAlificado - To Do

## 1. Entidades

### Usuário
Representa quem usa o app.

- id           UUID, identificador único
- email        texto, único, obrigatório
- senha        hash da senha, obrigatório    (nunca armazenar texto puro)
- criado_em    data/hora de criação

### Categoria
Rótulo de organização criado pelo próprio usuário.

- id           UUID, identificador único
- nome         texto, obrigatório
- usuario_id   referência ao dono (Usuário), obrigatório
- criado_em    data/hora de criação

Restrições:
- nome é único POR usuário (RN-04). Dois usuários podem ter "Trabalho";
  o mesmo usuário não pode ter "Trabalho" duas vezes.

### Tarefa
O item de afazer em si.

- id            UUID, identificador único
- titulo        texto, obrigatório, não vazio
- concluida     booleano, obrigatório, padrão = falso
- usuario_id    referência ao dono (Usuário), obrigatório
- categoria_id  referência à Categoria, OPCIONAL (pode ser vazio)
- criado_em     data/hora de criação

## 2. Relações

- Usuário 1 -- N Categoria
  Um usuário tem várias categorias; toda categoria pertence a um usuário.

- Usuário 1 -- N Tarefa
  Um usuário tem várias tarefas; toda tarefa pertence a um usuário.

- Categoria 1 -- N Tarefa  (opcional do lado da tarefa)
  Uma categoria pode estar em várias tarefas; uma tarefa tem zero ou
  uma categoria.

## 3. Regra de exclusão (RN-07)

Ao excluir uma Categoria, suas tarefas NÃO são apagadas: a referência
categoria_id delas é esvaziada e elas passam a ficar "sem categoria".

## 4. Decisão de modelagem: "sem categoria"

O estado "sem categoria" é representado por categoria_id vazio (ausência
de referência), e não por uma categoria especial chamada "Geral".

Por quê: uma linha mágica "Geral" precisaria existir para todo usuário,
poderia ser excluída por engano e exigiria tratamento especial em todo
lugar. A ausência de referência é mais simples e expressa exatamente o
que queremos dizer: "esta tarefa não tem categoria".

## 5. Decisão de modelagem: identificadores

Todos os ids são UUID.

Por quê: além de não depender de um contador central, UUIDs não são
enumeráveis. Em um app multiusuário com isolamento (RN-01), isso evita
que um id seja "adivinhado" incrementando outro, somando uma camada de
proteção mesmo que uma verificação de dono falhe.

## 6. Decisão de modelagem: situação da tarefa

A conclusão é um booleano (concluida).

Por quê: é o suficiente para o escopo atual, que só precisa saber SE a
tarefa está concluída, não QUANDO. Caso a data de conclusão se torne
necessária no futuro, basta adicionar um campo concluida_em opcional —
uma mudança aditiva que não quebra o que já existe.

## 7. Isolamento por usuário (RN-01)

Toda consulta a tarefas e categorias é sempre filtrada pelo usuário dono.
Nenhuma operação deve permitir acessar ou alterar dados de outro usuário.
(O COMO disso fica no design do back.)
# Requisitos — QAlificado - To Do

## 1. Visão geral

Um aplicativo multiusuário para registrar tarefas do dia a dia, organizá-las
em categorias criadas pelo próprio usuário e marcar o que já foi concluído.
Cada pessoa acessa com sua conta e enxerga somente os seus próprios dados.

## 2. Problema que resolve

Tarefas anotadas em papel, na cabeça ou espalhadas em vários apps se perdem.
O usuário quer um lugar próprio e seguro onde consiga ver tudo, organizar por
contexto e ter a sensação de progresso ao concluir itens.

## 3. Atores

- Usuário autenticado: registra-se, entra com sua conta e gerencia suas
  próprias tarefas e categorias. Não tem acesso aos dados de outros usuários.

## 4. Histórias de usuário

### Autenticação

#### HU-01 — Criar conta
Como visitante, quero criar uma conta,
para começar a usar o aplicativo.

Critérios de aceitação:
- Informo e-mail e senha para me cadastrar
- Não consigo me cadastrar com um e-mail já utilizado
- Senha em branco ou e-mail inválido impedem o cadastro com aviso claro

#### HU-02 — Entrar e sair
Como usuário, quero entrar com minha conta e sair quando quiser,
para proteger meus dados.

Critérios de aceitação:
- Com credenciais corretas, acesso minhas tarefas
- Com credenciais erradas, recebo um aviso e não entro
- Consigo encerrar a sessão a qualquer momento

### Categorias

#### HU-03 — Criar categoria
Como usuário, quero criar minhas próprias categorias,
para organizar tarefas do meu jeito.

Critérios de aceitação:
- Informo um nome e crio a categoria
- Não consigo criar duas categorias com o mesmo nome
- Nome em branco impede a criação com aviso

#### HU-04 — Ver e excluir categorias
Como usuário, quero ver e remover minhas categorias,
para manter a organização limpa.

Critérios de aceitação:
- Vejo a lista das minhas categorias
- Consigo excluir uma categoria
- Ao excluir uma categoria com tarefas, acontece o seguinte: [DECISÃO EM ABERTO #B]

### Tarefas

#### HU-05 — Criar tarefa
Como usuário, quero adicionar uma tarefa com título,
para registrar algo que preciso fazer.

Critérios de aceitação:
- Informo um título e salvo a tarefa
- Uma tarefa recém-criada começa como "não concluída"
- Título em branco impede a criação com aviso
- Sobre a categoria no momento da criação: [DECISÃO EM ABERTO #A]

#### HU-06 — Ver minhas tarefas
Como usuário, quero ver a lista das minhas tarefas,
para saber o que tenho pela frente.

Critérios de aceitação:
- Vejo todas as minhas tarefas em uma lista
- Cada item mostra título, categoria e situação (concluída ou não)
- Sem nenhuma tarefa, vejo uma mensagem de lista vazia

#### HU-07 — Concluir tarefa
Como usuário, quero marcar uma tarefa como concluída,
para acompanhar meu progresso.

Critérios de aceitação:
- Marco uma tarefa não concluída como concluída
- Desmarco uma concluída (volta a não concluída)
- Tarefas concluídas seguem visíveis, indicadas como tal

#### HU-08 — Filtrar por categoria
Como usuário, quero filtrar a lista por categoria,
para focar em um contexto de cada vez.

Critérios de aceitação:
- Ao selecionar uma categoria, vejo só as tarefas dela
- Sem categoria selecionada, vejo todas
- Categoria sem tarefas exibe mensagem de vazio

#### HU-09 — Excluir tarefa
Como usuário, quero remover uma tarefa,
para limpar o que não faz mais sentido.

Critérios de aceitação:
- Excluo uma tarefa da lista
- Após excluir, ela não aparece mais

## 5. Regras de negócio

- RN-01: Cada usuário só acessa suas próprias tarefas e categorias
- RN-02: Toda tarefa pertence a exatamente um usuário
- RN-03: O título da tarefa não pode ser vazio nem só espaços
- RN-04: O nome da categoria é único por usuário (não global)
- RN-05: Tarefas e categorias permanecem salvas entre acessos
- RN-06: Sobre tarefa ter ou não categoria obrigatória: [DECISÃO EM ABERTO #A]

## 6. Fora de escopo (por enquanto)

- Datas de vencimento e lembretes
- Subtarefas
- Compartilhar tarefas entre usuários
- Editar título de tarefa ou nome de categoria depois de criados
- Recuperação de senha
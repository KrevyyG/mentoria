# PRD — App de Tarefas (QA)

- Produto: App de Tarefas (multiusuário)
- Versão do documento: 1.0
- Data: 08/06/2026
- Status: definições fechadas, pronto para desenvolvimento
- Natureza: projeto de estudo, usado como base de mentoria

Este PRD consolida as definições do projeto em uma visão de produto. O
detalhamento técnico vive nas specs (ver seção 16); aqui está o "o quê e
por quê" em nível de produto.

## 1. Resumo executivo

App web multiusuário para registrar tarefas do dia a dia, organizá-las em
categorias criadas pelo próprio usuário e acompanhar o que já foi concluído.
Cada pessoa acessa com sua conta e enxerga apenas os seus dados. O projeto
é construído front e back separados, com foco em servir de material de
mentoria e em manter custo zero.

## 2. Contexto e problema

Tarefas anotadas em papel, na memória ou espalhadas em vários apps se
perdem. O usuário quer um lugar próprio e seguro onde consiga ver tudo,
organizar por contexto (trabalho, casa, estudos) e ter a sensação de
progresso ao concluir itens.

## 3. Objetivos

Objetivos de produto:
- Permitir que cada usuário gerencie suas tarefas e categorias com
  segurança e isolamento entre contas.
- Entregar o ciclo completo de um CRUD com organização e filtro, de forma
  simples e direta.

Objetivos de aprendizado (mentoria):
- Demonstrar o fluxo de specs: requisito vira contrato, vira design, vira
  tarefa, com rastreabilidade ponta a ponta.
- Exercitar arquitetura em camadas no back, separação de estado de servidor
  e de interface no front, autenticação própria e isolamento de dados.

## 4. Público-alvo

Usuário final: pessoa autenticada que gerencia as próprias tarefas. Não há
papéis administrativos nem acesso a dados de terceiros.

Contexto de uso do projeto: mentor e pessoa mentorada usam o código e as
specs como material de estudo.

## 5. Escopo

Dentro do escopo:
- Cadastro e login de usuários
- Criar, listar, concluir/desmarcar e excluir tarefas
- Criar, listar e excluir categorias (criadas pelo usuário)
- Associar uma categoria opcional a cada tarefa
- Filtrar tarefas por categoria, por "sem categoria" e por situação

Fora do escopo (por ora):
- Datas de vencimento, lembretes e subtarefas
- Compartilhar tarefas entre usuários
- Editar título de tarefa ou nome de categoria após criados
- Recuperação de senha, verificação de e-mail e refresh token
- Deploy/hospedagem (o projeto roda localmente para estudo)

## 6. Requisitos funcionais

Resumo das histórias; critérios completos em 01-requisitos.md.

Autenticação:
- HU-01 Criar conta: e-mail e senha; e-mail único; valida entrada.
- HU-02 Entrar e sair: acesso com credenciais válidas; sessão encerrável.

Categorias:
- HU-03 Criar categoria: nome obrigatório, único por usuário.
- HU-04 Ver e excluir categorias: ao excluir, as tarefas da categoria
  passam a ficar "sem categoria" (não são apagadas).

Tarefas:
- HU-05 Criar tarefa: título obrigatório; categoria opcional.
- HU-06 Ver tarefas: lista do usuário; estado de lista vazia.
- HU-07 Concluir/desmarcar: alterna a situação; concluídas seguem visíveis.
- HU-08 Filtrar: por categoria, por "sem categoria" e por situação;
  estado de resultado vazio.
- HU-09 Excluir tarefa: remove da lista.

## 7. Regras de negócio

- RN-01: Cada usuário só acessa as próprias tarefas e categorias.
- RN-02: Toda tarefa pertence a exatamente um usuário.
- RN-03: O título da tarefa não pode ser vazio nem só espaços.
- RN-04: O nome da categoria é único por usuário (não global).
- RN-05: Tarefas e categorias permanecem salvas entre acessos.
- RN-06: A categoria de uma tarefa é opcional (zero ou uma).
- RN-07: Excluir uma categoria não exclui suas tarefas; elas ficam
  "sem categoria".

## 8. Requisitos não-funcionais

- Segurança: senhas guardadas como hash (argon2), nunca em texto puro;
  autenticação por token Bearer (JWT); isolamento por usuário em toda
  operação; recurso de outro usuário responde 404 (não revela existência).
- Custo: banco no Supabase em plano gratuito; sem custos no momento.
- Idioma: produto e mensagens em português do Brasil.
- Aparência: tema escuro (dark-first), conforme a identidade visual.
- Disponibilidade: para estudo, a pausa por inatividade do plano gratuito
  do Supabase é aceitável (o projeto não exige 24/7).

## 9. Decisões de arquitetura e tecnologia

Stack:
- Back-end: TypeScript, NestJS, Prisma, PostgreSQL (Supabase só como banco),
  autenticação própria com JWT e argon2.
- Front-end: React, Vite, TypeScript, React Router, TanStack Query.

Decisões-chave (detalhe e justificativa nas specs):
- Identificadores em UUID, não enumeráveis (02-modelo-dados).
- Recurso de outro usuário responde 404, nunca 403; implementado pelo
  filtro where { id, usuarioId } (03 e 04).
- Envelope de erro único: { erro: { codigo, mensagem } } (03).
- Categoria opcional; excluir categoria usa onDelete SetNull (02, 04).
- Supabase apenas como banco; toda a autenticação vive no NestJS (04).
- Token guardado no localStorage, com a mitigação de evitar XSS (05).
- JWT sem estado, com um único token de acesso (04).

## 10. Identidade visual

Tema escuro. Três cores de marca, extraídas da logo:
- Preto (fundo): #131313
- Branco (texto): #FFFFFF
- Laranja (destaque): #E66A01 (estado intenso: #DA5102)

As cores viram tokens semânticos (variáveis CSS); nenhum hex é escrito
direto nos componentes. A logo tem variações para uso solto (com contorno)
e em bloco (badge quadrado e redondo), além dos ícones de aba/app.
Detalhes em identidade-visual/identidade-visual.md.

## 11. Plano de entrega

Estratégia: fatias verticais (cada entrega funciona de ponta a ponta).
- Fase 0: fundação (projetos, banco, conexões, base do front e do back).
- Fatia 1: autenticação.
- Fatia 2: criar e ver tarefas.
- Fatia 3: concluir e desmarcar.
- Fatia 4: excluir tarefa.
- Fatia 5: categorias e categoria na tarefa.
- Fatia 6: filtros.

Passo a passo detalhado em 06-tarefas.md.

## 12. Critérios de sucesso

Como é um projeto de estudo, o sucesso não é uma métrica de negócio, e sim:
- Funcional: todas as histórias (HU-01 a HU-09) atendem seus critérios de
  aceitação, funcionando de ponta a ponta.
- Técnico: o código demonstra os conceitos-alvo (camadas no back, separação
  de estado no front, autenticação e isolamento).
- Mentoria: a pessoa mentorada consegue explicar as decisões-chave (por que
  UUID, por que 404, por que token no localStorage, etc.).

## 13. Premissas e restrições

- Custo zero no momento (plano gratuito do Supabase).
- Execução local; sem deploy nesta fase.
- Um usuário por conta; sem papéis ou permissões adicionais.

## 14. Riscos

- Pausa por inatividade do Supabase (plano gratuito) após 7 dias sem
  atividade no banco; mitigável com um ping diário se incomodar.
- Token em localStorage é exposto a XSS; mitigação é evitar XSS (o React
  já escapa conteúdo por padrão; não usar HTML não confiável).

## 15. Evoluções futuras (fora do escopo atual)

Datas e lembretes, subtarefas, edição de título/nome, recuperação de senha,
verificação de e-mail, refresh token, deploy, tema claro (exigiria variante
da logo com letras escuras) e definição de tipografia como token.

## 16. Documentos de referência

- specs/01-requisitos.md — histórias e critérios completos
- specs/02-modelo-dados.md — entidades e relações
- specs/03-contrato-api.md — endpoints e respostas
- specs/04-design-back.md — design do servidor
- specs/05-design-front.md — design do cliente
- specs/06-tarefas.md — plano de execução em fatias
- identidade-visual/identidade-visual.md — cores, tokens e logo
- CLAUDE.md — contexto fixo para o Claude Code
# Design do Front-end — App de Tarefas

Como o cliente consome o contrato (03-contrato-api.md). O back não muda.

## 1. Stack

- React + Vite + TypeScript
- Roteamento: React Router
- Consumo da API: cliente HTTP tipado sobre fetch
- Estado do servidor: TanStack Query

## 2. Estrutura de pastas

    src/
      main.tsx               envolve o app no QueryClientProvider
      App.tsx                rotas
      api/
        client.ts            base URL + envio do token + tratamento de 401
        tarefas.ts           funções que batem nos endpoints de tarefa
        categorias.ts
        auth.ts
      hooks/
        useTarefas.ts        queries e mutations de tarefa (TanStack Query)
        useCategorias.ts
      tipos/
        index.ts             Tarefa, Categoria (espelham o contrato)
      auth/
        AuthContext.tsx      guarda o token e o usuário logado
        RotaProtegida.tsx    redireciona para /login sem token
      telas/
        Login.tsx
        Registro.tsx
        Tarefas.tsx          tela principal
        Categorias.tsx
      componentes/
        FormularioTarefa.tsx
        ItemTarefa.tsx
        FiltroCategorias.tsx
        EstadoVazio.tsx

## 3. Telas e o que cada uma cobre

- Registro (/registro)        HU-01
- Login (/login)              HU-02
- Tarefas (/)  protegida      HU-05, HU-06, HU-07, HU-08, HU-09
    criar, listar, concluir/desmarcar, filtrar, excluir
- Categorias (/categorias) protegida   HU-03, HU-04
    criar, listar, excluir

## 4. Estado do servidor x estado de interface

A distinção que organiza o front inteiro:

- Estado do servidor: a lista de tarefas e de categorias. Vem da API, pode
  ficar "velho", precisa ser recarregado após criar/alterar/excluir.
  Quem cuida disso é o TanStack Query.
- Estado de interface: qual filtro está selecionado, o texto digitado no
  formulário, se um diálogo está aberto. Vive só no navegador, em useState.

Misturar os dois é a origem de metade dos bugs de front. O TanStack Query
existe justamente para tratar o estado do servidor com as ferramentas
certas (cache, recarregamento, invalidação), deixando o useState livre
para o que é só visual.

## 5. TanStack Query: chaves e invalidação

- Cada conjunto de dados tem uma chave de query:
    ["tarefas", filtros]   e   ["categorias"]
- Ler dados = useQuery com essa chave
- Alterar dados = useMutation (criar, concluir, excluir, criar categoria...)
- Após uma mutation, invalida-se a chave afetada; o TanStack Query
  recarrega a lista automaticamente

Exemplo do ciclo: concluir uma tarefa dispara a mutation PATCH; ao terminar,
invalida ["tarefas"]; a lista volta da API já com a tarefa marcada. Sem
manipular a lista na mão.

## 6. Consumo da API e o token

O cliente HTTP central (api/client.ts):
- usa a base URL de uma variável de ambiente (VITE_API_URL)
- anexa o header Authorization: Bearer <token> quando há token
- se a API responde 401, limpa o token e manda para /login (token expirou)
- lê o envelope de erro padrão e expõe { codigo, mensagem } para a tela

## 7. Fluxo de autenticação

- Login bem-sucedido: guarda o token (ver seção 9) e vai para /
- Rota protegida sem token: redireciona para /login
- Logout: descarta o token e volta para /login
  (coerente com o back sem estado: sair = esquecer o token)

## 8. Erros e estados vazios

- Erros da API são exibidos a partir de erro.mensagem
- Lista de tarefas sem itens: mensagem de lista vazia (HU-06)
- Filtro sem resultado: mensagem de vazio específica do filtro (HU-08)

## 9. Decisão: armazenamento do token

O token fica no localStorage.

Por quê: persiste entre recarregamentos, então o usuário não precisa logar
de novo a cada F5. O custo é que o token fica acessível a qualquer script
da página — ou seja, exposto a XSS.

Mitigação correta: evitar XSS em si, não inventar um esconderijo. O React
já escapa conteúdo por padrão; o cuidado é não usar dangerouslySetInnerHTML
com conteúdo não confiável e não injetar HTML de terceiros. A alternativa
mais blindada (cookie httpOnly) foi descartada quando escolhemos token
Bearer no contrato. Esta troca é intencional e adequada a um projeto de
estudo.

## 10. Tipos compartilhados

Os tipos Tarefa e Categoria espelham os objetos do contrato. Como back e
front são ambos TypeScript, no futuro dá para extrair esses tipos para um
pacote compartilhado e ter uma só fonte da verdade. Por ora, ficam
duplicados no front para manter o projeto simples.

## 11. Decisões registradas (revisáveis)

- DR-01: React Router para navegação (padrão do ecossistema Vite/React)
- DR-02: Um cliente HTTP central, em vez de fetch espalhado pelas telas,
  para concentrar token e tratamento de erro num lugar só
- DR-03: TanStack Query para todo estado de servidor; useState apenas para
  estado de interface
# Identidade Visual — App de Tarefas (QA)

Referência de marca do projeto. O 05-design-front.md consome estes tokens;
nenhum hex deve ser escrito direto nos componentes.

## 1. Cores da marca

São três cores de marca, extraídas diretamente da logo:

- Preto (fundo):     #131313   preto suavizado, não puro
- Branco (texto):    #FFFFFF
- Laranja (destaque): #E66A01

Observação: o preto é #131313, e não #000000. Esse tom levemente acima do
preto puro dá um acabamento mais suave à tela e é proposital — usar
#000000 deixaria a interface mais "dura".

## 2. Tokens semânticos

Boa prática: a marca tem 3 cores, mas a interface precisa de mais alguns
tons (superfícies, texto suave, bordas). Estes são DERIVADOS das cores de
marca para uso de UI — dê nome ao papel, não ao valor.

Marca:
- --cor-fundo:           #131313   fundo base da aplicação
- --cor-texto:           #FFFFFF   texto e ícones principais
- --cor-destaque:        #E66A01   ações, foco, links, hover de chamado
- --cor-destaque-forte:  #DA5102   estado pressionado/hover intenso
                                   (laranja escuro tirado da própria logo)

Derivados de UI (recomendados, ajustáveis):
- --cor-superficie:      #1E1E1E   cards, inputs, barras sobre o fundo
- --cor-texto-suave:     #A0A0A0   textos secundários, placeholders
- --cor-borda:           #2A2A2A   divisórias e contornos sutis
- --cor-perigo:          #E5484D   erros e ações destrutivas (excluir)

Por que separar marca de UI: as 3 cores de marca são fixas; os derivados
existem só para a interface respirar. Se a marca mudar, troca-se na origem.

## 3. Tema (dark-first)

A identidade é escura por natureza: fundo preto, texto branco, laranja como
acento. O sistema nasce em tema escuro. Um eventual tema claro seria um
trabalho futuro e exigiria uma variante da logo com letras escuras
(ver seção 5).

## 4. Como vira código

Os tokens viram variáveis CSS, definidas uma vez e usadas em todo lugar.
Sugestão: src/estilos/tokens.css, importado no main.tsx.

    :root {
      --cor-fundo: #131313;
      --cor-texto: #FFFFFF;
      --cor-destaque: #E66A01;
      --cor-destaque-forte: #DA5102;
      --cor-superficie: #1E1E1E;
      --cor-texto-suave: #A0A0A0;
      --cor-borda: #2A2A2A;
      --cor-perigo: #E5484D;
    }

Os componentes usam o nome, nunca o hex:
    background: var(--cor-fundo)
    color: var(--cor-texto)
    /* botão chamativo */
    background: var(--cor-destaque)   /* :hover -> var(--cor-destaque-forte) */

Se o projeto usar Tailwind, os mesmos valores entram no theme.extend.colors,
referenciando as variáveis CSS.

## 5. Logo: arquivos e variações

Os arquivos vivem em identidade-visual/ (referência) e são copiados para o
front. Onde colocar no front:
- favicon.ico, favicon-32.png, apple-touch-icon-180.png,
  logo-badge-preto-192.png, logo-badge-preto-512.png  ->  public/
- logo-contorno.png, logo-badge-circulo-512.png  ->  src/assets/

Kit final (todas as peças partem do mesmo badge limpo, mantendo o padrão):

- logo-contorno.png (fundo transparente, com keyline preto)
    A logo solta, com um contorno preto sutil que dá separação em qualquer
    fundo (claro, escuro ou variável). É a versão para usar sobre conteúdo.
- logo-badge-preto-512.png e -192.png (bloco quadrado arredondado, preto)
    A logo encapsulada num bloco da marca, com borda sutil. Ícone de app,
    ícone de PWA, imagem de login, e marca contida em qualquer fundo.
- logo-badge-circulo-512.png (bloco circular, preto)
    Mesma ideia em formato redondo. Avatar de redes sociais e perfis.
- favicon.ico (16/32/48), favicon-32.png e apple-touch-icon-180.png
    Ícone da aba/título da página e de dispositivos Apple. Derivados do
    badge quadrado, então seguem a mesma identidade.

Observação: o arquivo original enviado continua sendo o mestre; estas peças
foram todas derivadas dele.

## 6. Uso por contexto (o que você pediu)

- Topo do sistema (header): logo-contorno.png, altura aproximada de 32 a
  40 px, com área de respiro ao redor. (Funciona sobre o header escuro e
  sobre qualquer outro fundo.)
- Ícone do título da página (favicon): favicon.ico (mais favicon-32.png e
  apple-touch-icon-180.png) referenciados no index.html do front.
- Página de login: logo-badge-preto-512.png centralizada, ou logo-contorno
  se preferir a logo solta.
- Avatar, ícone de app ou de PWA: logo-badge-preto (quadrado) ou
  logo-badge-circulo (redondo).
- A logo solta sobre qualquer conteúdo: logo-contorno.png.

Duas abordagens para "qualquer fundo": o contorno (keyline) deixa a logo
respirar solta; o bloco (badge) a encapsula num retângulo/círculo da marca.
Use o contorno em texto/cabeçalhos e o bloco onde a marca precisa virar um
ícone fechado (avatar, app).

## 7. Regras de uso (do's and don'ts)

- Não recolorir a logo (manter branco + laranja sobre fundo escuro)
- Não distorcer, rotacionar ou aplicar sombra/efeito
- Manter uma área de respiro mínima ao redor (sem texto colado)
- Para a logo solta, usar sempre a versão com contorno (logo-contorno),
  que se segura em qualquer fundo
- Tamanho mínimo legível: não reduzir o lockup completo abaixo de ~24 px
  de altura; em tamanhos muito pequenos, prefira um ícone simplificado

## 8. Itens em aberto

- Tipografia: ainda não definida. Por ora, fonte do sistema. Escolher uma
  família e registrar como token (--fonte-base) é uma evolução natural.
- Variante da logo para fundo claro (letras escuras): só será necessária se
  um tema claro entrar em escopo.

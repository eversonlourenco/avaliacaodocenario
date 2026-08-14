# Avaliação da Cena — Informe Operacional

App web (PWA) para preenchimento rápido da avaliação de cena de ocorrência e geração de informe operacional para a sala de comunicações. Funciona **100% offline** depois do primeiro carregamento e pode ser **instalado** na tela inicial do Android e do iPhone, como um app nativo.

## O que o app faz

1. **Tela 1 — Ocorrência:** escolha do tipo (Incêndio em Edificações, Fogo em Veículo, Colisão, Capotagem, Queda de Veículo, Fogo em Vegetação).
2. **Tela 2 — Local:** escolha do subtipo e quantidade de veículos (quando aplicável). Para edificações residenciais, coleta detalhes extras (tipo de imóvel, andar, pavimentos, cômodo do fogo).
3. **Tela 3 — Detalhes:** perguntas específicas do tipo escolhido (situação encontrada, danos, material queimando/transportado, vítimas por cor de triagem, recursos empregados, observações).
4. **Tela 4 — Informe:** gera o texto do informe operacional, com botões para:
   - **Enviar pelo WhatsApp** (abre o WhatsApp com o texto pronto)
   - **Copiar Texto** (copia para a área de transferência)
   - **Zerar Formulário** (limpa tudo e recomeça)

Todo o processamento acontece no aparelho — nenhum dado é enviado para servidor algum.

## Hospedar no GitHub Pages (gratuito)

1. Crie um repositório novo no GitHub (ex: `avaliacao-cena`) e envie todos os arquivos desta pasta para a raiz dele.
2. No repositório, vá em **Settings → Pages**.
3. Em **Source**, selecione a branch `main` e a pasta `/ (root)`. Salve.
4. Em alguns minutos o app estará disponível em:
   `https://SEU-USUARIO.github.io/avaliacao-cena/`

Ou, via linha de comando:

```bash
git init
git add .
git commit -m "Avaliação da Cena — app inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/avaliacao-cena.git
git push -u origin main
```

Depois ative o GitHub Pages como descrito acima.

> ⚠️ Importante: como o app usa caminhos relativos (`./`), ele funciona tanto na raiz de um domínio quanto em um subcaminho (`usuario.github.io/repo/`). Não é necessário nenhum ajuste extra.

## Instalar no celular

### Android (Chrome)
1. Abra o link do app no Chrome.
2. Toque no menu (⋮) → **Adicionar à tela inicial** (ou aparecerá um banner automático "Instalar app").
3. Confirme. O ícone aparecerá como um app normal, abrindo em tela cheia, sem a barra do navegador.

### iPhone/iPad (Safari)
1. Abra o link do app no **Safari** (precisa ser o Safari, não Chrome).
2. Toque no ícone de **Compartilhar** (quadrado com seta para cima).
3. Escolha **Adicionar à Tela de Início**.
4. Confirme. O app abrirá em tela cheia como um app nativo.

## Funcionamento offline

Na primeira visita (com internet), um *service worker* guarda automaticamente todos os arquivos do app no aparelho. Depois disso, o app abre e funciona normalmente **sem internet** — inclusive gerar o informe e copiar o texto. Só o botão **Enviar pelo WhatsApp** precisa de internet/WhatsApp instalado no momento do envio (o informe pode ser gerado e copiado offline e enviado depois, quando houver sinal).

Sempre que você atualizar os arquivos do app no GitHub, mude o valor de `CACHE_VERSION` em `service-worker.js` (ex: `v1` → `v2`) para que os aparelhos baixem a versão nova.

## Estrutura de arquivos

```
index.html          → estrutura da página
manifest.json        → configuração de instalação (PWA)
service-worker.js    → cache offline
css/style.css        → visual do app
js/app.js             → dados dos formulários, lógica e geração do informe
icons/                → ícones do app (192px, 512px, 512px maskable)
```

## Personalizar

- **Cores/visual:** editar `css/style.css` (variáveis no topo do arquivo, em `:root`).
- **Perguntas e opções dos formulários:** editar as constantes no início de `js/app.js` (ex: `TIPOS`, `MATERIAL_EDIFICACOES`, listas de checkbox etc.) — dá para adicionar, remover ou renomear itens sem mexer no resto do código.
- **Ícone do app:** substituir os arquivos em `icons/` mantendo os mesmos nomes e tamanhos.

## Formato do Informe

O texto gerado na tela 4 segue o modelo:

```
AVALIAÇÃO DA CENA
DATA: 08/08/2026
HORA: 01:41 (coleta das informações)
COORDENADAS: -22.5064, -43.1789
ENDEREÇO: Rua das Flores, 123 - Centro
MISSÃO: INCÊNDIO
--------------------------------
TIPO: INCÊNDIO EM EDIFICAÇÕES
SUBTIPO: Edificações Residenciais
Edificação: Casa
Andar: 1
Pavimentos: 02
Fogo no pavimento: 02
Cômodo(s) com fogo: Sala, Cozinha
--------------------------------
SITUAÇÃO ENCONTRADA: Pequeno, Controlado
DANOS: Parcial
MATERIAL QUEIMANDO: Sólidos (Classe A) — Sofás, Camas, Colchões | Líquidos Inflamáveis (Classe B) — Gasolina
--------------------------------
VÍTIMAS: 4 | Verdes: 1 | Amarelas: 1 | Vermelhas: 1 | Cinzas: 1
SITUAÇÃO DAS VÍTIMAS: Em atendimento (ASE, SAMU)
--------------------------------
RECURSOS: Vtrs: 3 (ABSL, ABS, ASE) | Efetivo: 9
--------------------------------
OBSERVAÇÕES: Atualização de perímetro concluída.
```

Campos e seções sem informação preenchida não aparecem no informe (a linha inteira, ou o bloco inteiro, some — em vez de ficar em branco). COORDENADAS e ENDEREÇO são digitados na própria tela do informe, logo acima do texto, e atualizam o texto automaticamente enquanto você digita. DATA e HORA são preenchidos sozinhos no momento em que você toca em "Gerar Informe". MISSÃO é definida automaticamente a partir do tipo de ocorrência (INCÊNDIO ou ACIDENTE DE TRÂNSITO).

## Observação sobre a estrutura do questionário

O documento original definia claramente as perguntas para os tipos "Incêndio em Edificações", "Fogo em Veículo", "Queda de Veículo" e "Fogo em Vegetação". Para os tipos "Colisão de Veículos" e "Capotagem de Veículo" — que não tinham perguntas próprias listadas — foi aplicado o mesmo conjunto de perguntas de "Queda de Veículo", por serem todas ocorrências de trânsito com estrutura semelhante (situação encontrada, bloqueio de via, material transportado, vítimas, recursos). Ajuste livremente em `js/app.js` caso a sala de comunicações use um roteiro diferente para esses dois tipos.

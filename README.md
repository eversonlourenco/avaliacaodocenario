# 🚒 Avaliação da Cenas — Informe Operacional

Aplicação Web PWA simples, rápida e responsiva para apoio a equipes de emergência e resgate na recolha de dados de ocorrências e geração automatizada de relatórios formatados para envio via WhatsApp ou cópia de texto.

---

## 📌 Versão Atual
**v1.2.0** (14/08/2026)

---

## 📖 Guia de Utilização (Leia-me)

1. **Escolha o Tipo de Ocorrência:** Selecione entre Acidentes de Trânsito, Incêndios, etc.
2. **Selecione os Subtipos / Veículos:** Clique nos itens envolvidos. Use a caixa *Outros* + *OK* para inserir itens customizados.
3. **Preencha os Detalhes da Cena:** Defina a situação, classificação de vítimas (triagem de cores), recursos empregados e bloqueios de via.
4. **Gere o Informe Operacional:** O relatório formatado inclui data, hora e geolocalização automática via OpenStreetMap.
5. **Ações Rápidas:** Envie diretamente para grupos do WhatsApp ou copie para a área de transferência.

---

## 🚀 Funcionalidades

- **Design Dark Mode:** Otimizado para leitura em campo e baixa luminosidade.
- **Geolocalização Automática:** Obtenção de latitude, longitude e endereço reverso via API OpenStreetMap (Nominatim).
- **Sem Dependências Externas:** Construído em JS Vanilla puro (HTML5, CSS3, ES6+).
- **Suporte Offline (PWA):** Pronto para funcionar mesmo em locais sem conectividade através do Service Worker.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3** (Variáveis CSS, CSS Grid, Flexbox)
- **JavaScript (ES6+)**
- **Service Worker API** (PWA)
- **Nominatim / OpenStreetMap API**

---

## 🏷️ Padrão de Versionamento

Este projeto adota o padrão **Semantic Versioning (`MAJOR.MINOR.PATCH`)**:
- **MAJOR (`X`):** Mudanças estruturais significativas no aplicativo.
- **MINOR (`Y`):** Novas funcionalidades, novos tipos de ocorrência ou telas adicionais.
- **PATCH (`Z`):** Correções de bugs e pequenos ajustes visuais.
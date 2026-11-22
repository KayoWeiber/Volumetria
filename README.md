# Projeto: Volumetria de Cervejas em Latas

[![GitHub](https://img.shields.io/badge/Projeto-Volumetria-blue?style=flat-square&logo=github)](https://kayoweiber.github.io/Volumetria/)

Este projeto foi desenvolvido para facilitar e automatizar o processo de cálculo da volumetria de cervejas em latas, tornando mais prático e eficiente o controle no dia a dia de operações. 

🔗 **[Acesse o projeto aqui](https://kayoweiber.github.io/Volumetria/)**

---

## 🎯 Objetivo do Projeto

O sistema tem como objetivo calcular rapidamente o volume de líquido nas latas, além de fornecer análises úteis como:
- Volume médio das latas.
- Menor e maior volume registrado no pacote.
- Comparação do volume médio com o limiar de enchimento.

Tudo isso com uma interface intuitiva e fácil de usar, projetada para usuários com pouco conhecimento em informática.

---

## 🚀 Funcionalidades

1. **Tela de Configuração Inicial:**
   - Informar o peso da lata vazia, peso da tampa, densidade do líquido e o limiar de enchimento.
   - Escolher a quantidade de latas no pacote (12 ou 15).

2. **Tela de Entrada de Dados:**
   - Insira o peso de cada lata cheia no pacote.
   - Visualização dinâmica para os inputs, ajustados de acordo com a quantidade selecionada.

3. **Resultados:**
   - Exibição dos volumes de todas as latas.
   - Cálculo da volumetria média, menor e maior volume.
   - Indicação visual se o volume médio está dentro ou fora do padrão definido pelo limiar.

4. **Salvamento no Navegador:**
   - Configurações previamente usadas são armazenadas no navegador (Local Storage) para reutilização.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 / CSS3 / JavaScript (ES Modules):** sem dependências nem build.
- **Local Storage:** armazenamento das configurações iniciais.

---

## 🗂️ Estrutura

```
index.html
assets/
├── css/style.css
├── images/logo-kw.svg
└── js/
    ├── main.js      # orquestra os eventos e o fluxo entre telas
    ├── calculo.js   # regras de negócio (funções puras)
    ├── ui.js        # DOM: troca de telas e renderização
    └── storage.js   # persistência da configuração
```

## ▶️ Como rodar

Por usar ES Modules, o app precisa ser servido por HTTP (abrir o `index.html` direto via `file://` não funciona):

```
python -m http.server 8000
```

e acessar `http://localhost:8000`.

---

## 📷 Layout do Projeto

### Tela de Configuração Inicial
Configuração dos parâmetros iniciais para o cálculo.

### Tela de Entrada de Pesos
Interface dinâmica para entrada dos dados de cada lata cheia.

### Resultados
Relatório completo com volumetria individual e análises agregadas.


 

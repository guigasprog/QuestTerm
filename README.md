# QuestTerm 🚀

<p align="center">
  <img src="https://i.imgur.com/link-para-sua-logo.png" alt="Logo do QuestTerm" width="200"/>
</p>

<p align="center">
  <strong>Um portfólio de desenvolvedor interativo, disfarçado de terminal CLI com um RPG completo.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions">
</p>

---

## 🎮 O Projeto

**QuestTerm** é a minha solução para o clássico portfólio de desenvolvedor. Em vez de apenas _ler_ sobre minhas habilidades, você pode _interagir_ com elas.

O projeto se apresenta como um terminal de linha de comando onde você pode usar comandos Unix-like (`help`, `projects`, `skills`, `contact`) para navegar pelo meu perfil profissional.

**...Mas há um "pulo do gato" (Easter Egg):**
O terminal também é um "motor" de jogo. Ao digitar `new game`, você inicia um mini-RPG completo, com classes, níveis, combate em turnos, loot, loja e persistência de dados.

### ➡️ [Clique aqui para jogar (Live Demo)](https://SEU-USUARIO.github.io/SEU-REPOSITORIO/)

![Screenshot do QuestTerm](https://i.imgur.com/link-para-seu-screenshot.png)

## ✨ Funcionalidades (Comandos)

### Comandos do Portfólio

- `help`: Lista todos os comandos disponíveis.
- `projects`: Busca e exibe meus repositórios reais e fixados, diretamente da API do GitHub.
- `open [numero]`: Abre o link de um projeto do GitHub em uma nova aba.
- `skills`: Lista as tecnologias e habilidades que eu domino.
- `contact`: Exibe minhas informações de contato profissional.
- `clear`: Limpa o histórico do terminal.

### Comandos do RPG (Quest)

- `new game` / `ng`: Inicia um novo jogo, permitindo criar um personagem (Guerreiro, Ladino ou Mago).
- `abandon character`: Apaga seu personagem salvo no `localStorage` e o salva no `memorial`.
- `memorial`: Exibe o "Hall da Fama" do último personagem que morreu ou foi abandonado.
- `stats`: Exibe os atributos do seu personagem (HP, Ouro, Nível, EXP, Atributos, Equipamento e Efeitos de Status).
- `train`: (Fora de combate) Gasta um ponto de treino para aumentar um atributo aleatório.
- `abilities`: Lista todas as magias (`Magic`) e habilidades (`Skill`) que seu personagem aprendeu.
- `i` / `inventory`: Mostra os itens no seu inventário.
- `use [item/habilidade]`: Usa uma poção (fora de combate) ou uma Habilidade de classe (em combate).
- `equip [item]`: Equipa uma arma ou armadura do seu inventário.
- `shop`: Visita a loja, que possui 3 itens rotativos (atualiza a cada 1 hora).
- `buy [numero]`: Compra um item da loja.
- `f` / `find battle`: Procura por uma batalha.

### Comandos de Combate

- `a` / `attack`: Realiza um ataque básico baseado em `STR`.
- `cast [magia]`: Lança uma magia (ex: `cast Bola de Fogo`).
- `use [item/habilidade]`: Usa uma Habilidade de classe (ex: `use Grito de Guerra`) ou um item (ex: `use Poção de Cura`).
- `run`: Tenta fugir da batalha (chance baseada em `DEX` e no nível do monstro).
- `stats`: (Ação Livre) Mostra os status do jogador e do monstro.

## 🛠️ Arquitetura e Stack

Este projeto foi construído com foco em uma arquitetura moderna, limpa e escalável, usando **TypeScript** em todo o código.

- **Framework:** **Next.js** (React)
- **Estilização:** **TailwindCSS** (para a UI do terminal)
- **Lógica de Estado (Cérebro do Jogo):** Hooks do React (`useReducer` e `useState`). Toda a lógica do jogo (combate, inventário, loja, etc.) é gerenciada em um único hook customizado: `useTerminalLogic`.
- **Tipagem:** **TypeScript** (Interface para Itens, Monstros, Classes, Habilidades, etc.).
- **Persistência:** `localStorage` do navegador. O estado do jogo e o memorial são salvos localmente, permitindo que o jogador continue de onde parou.
- **API Externa:** **GitHub API** (para popular dinamicamente a seção `projects`).
- **Deploy:** **GitHub Pages**, configurado para exportação estática (`output: 'export'`) e deploy automatizado via **GitHub Actions**.

## 🚀 Como Rodar Localmente

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git](https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git)
    cd SEU-REPOSITORIO
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Rode o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

4.  **Acesse:**
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

_Este projeto foi um desafio divertido de arquitetura de software, design de jogos e UI. Feito por [Seu Nome]._

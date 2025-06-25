# Estrutura do Código e Organização do Projeto

Este documento descreve a organização dos módulos, pacotes e camadas do projeto Menuzio, tanto no Backend quanto no Frontend.

---

## 1. Estrutura Geral de Pastas

O projeto está dividido em duas pastas principais, cada uma contendo uma parte da aplicação:

-   `backend/`: Contém todo o código-fonte da API RESTful.
-   `frontend/`: Contém todo o código-fonte da aplicação web (interface do usuário).

---

## 2. Backend (Node.js com Express e MongoDB)

O diretório `backend/` é organizado para promover a separação de responsabilidades (SRP) e facilitar a manutenção:

-   **`server.js`**:
    -   Ponto de entrada principal da aplicação.
    -   Responsável por configurar o servidor Express, conectar-se ao MongoDB e montar as rotas da API.
    -   Importa e utiliza os módulos de rota definidos em `routes/`.

-   **`routes/`**:
    -   Contém arquivos que definem as rotas da API e mapeiam URLs para funções controladoras.
    -   Exemplos: `auth.js` (para rotas de autenticação como login/registro), `pedido.js` (para rotas de gerenciamento de pedidos).
    -   Cada arquivo de rota utiliza o `express.Router()` para agrupar endpoints relacionados.

-   **`models/`**:
    -   Define os schemas (esquemas) para os documentos do MongoDB utilizando a biblioteca Mongoose.
    -   Cada arquivo neste diretório representa um modelo de dados (ex: `User.js`, `Pedido.js`), definindo a estrutura e validações dos documentos que serão armazenados no banco.

-   **`middlewares/`**:
    -   Contém funções intermediárias (middlewares) que são executadas entre a requisição e a resposta, ou entre outras middlewares.
    -   Exemplo: `authMiddleware.js` (responsável por verificar e validar o token JWT nas requisições protegidas).

-   **`utils/`**:
    -   (Pode existir ou ser criada) Contém funções utilitárias ou auxiliares que são reutilizáveis em diferentes partes do código, como funções de hash de senha, validação de dados, geradores de dados aleatórios (como o utilizado para pedidos).

-   **`config/`**:
    -   (Pode existir ou ser criada) Contém arquivos de configuração, como configurações de banco de dados, variáveis de ambiente (embora o `.env` seja a principal forma para isso).

-   **`controllers/` (Implícito ou Direto nas Rotas):**
    -   No projeto atual, a lógica dos "controllers" (que manipulam as requisições, interagem com modelos e enviam respostas) está em grande parte embutida diretamente nos arquivos de rota (`routes/`). Para projetos maiores, seria comum ter uma pasta `controllers/` separada, onde cada função de rota chamaria um método de um controller. Por exemplo, `pedido.js` (rota) chamaria `PedidoController.listarPedidos()`.

## 3. Frontend (React com Vite)

O diretório `frontend/` segue a estrutura padrão de projetos React/Vite:

-   **`public/`**:
    -   Contém arquivos estáticos que são servidos diretamente, como `index.html` (o ponto de entrada da aplicação React) e assets como imagens, ícones.

-   **`src/`**:
    -   Contém o código-fonte principal da aplicação React.
    -   **`main.jsx` (ou `main.js`)**: O ponto de entrada da aplicação React, onde o componente raiz (`App.jsx`) é renderizado no DOM.
    -   **`App.jsx`**: O componente raiz da aplicação, que geralmente define as rotas principais e o layout global.
    -   **`components/`**:
        -   Contém componentes React reutilizáveis e independentes.
        -   Exemplos: botões, inputs, cards de pedidos, cabeçalhos, rodapés.
        -   Promove a modularidade e a reutilização de código.
    -   **`pages/` (ou `views/`):**
        -   Contém os componentes de nível superior que representam as diferentes "páginas" ou "telas" da aplicação.
        -   Exemplos: `LoginPage.jsx`, `PedidosPage.jsx`.
        -   Geralmente orquestram múltiplos componentes menores.
    -   **`api/` (ou `services/`):**
        -   (Pode existir ou ser criada) Contém módulos ou funções responsáveis por interagir com a API do backend.
        -   Encapsula a lógica de fazer requisições HTTP (usando `fetch` ou bibliotecas como `axios`).
        -   Exemplo: `authService.js` (funções para login, registro), `pedidoService.js` (funções para listar, criar, atualizar pedidos).
    -   **`contexts/` (ou `store/`):**
        -   (Pode existir ou ser criada) Se o projeto usar gerenciamento de estado global (como React Context API ou Redux/Zustand), esta pasta conteria os provedores de contexto ou as lojas de estado.
    -   **`assets/` (ou `public/images`, `public/css`):**
        -   Contém arquivos de mídia como imagens, ícones, e arquivos de estilo (CSS).

## 4. Separação de Responsabilidades (Camadas)

A arquitetura do Menuzio segue uma separação de responsabilidades clara:

-   **Camada de Apresentação (Frontend):** Responsável pela interface do usuário e pela interação com o usuário. Não possui lógica de negócio ou acesso direto ao banco de dados. Comunica-se exclusivamente com a API do backend.
-   **Camada de Lógica de Negócio / API (Backend):** Atua como o intermediário. Contém a lógica para processar requisições, validar dados, gerenciar a autenticação e coordenar as operações de dados.
-   **Camada de Persistência de Dados (MongoDB):** Responsável pelo armazenamento e recuperação dos dados. O backend interage com esta camada através dos modelos do Mongoose.

Essa estrutura modular facilita o desenvolvimento, testes e a manutenção do sistema.
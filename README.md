# Documentação Geral do Projeto Menuzio

Este documento provê uma visão geral do projeto "Menuzio", uma aplicação full-stack para gerenciamento de pedidos em estabelecimentos como bares e restaurantes.

## 1. Visão Geral do Sistema

O Menuzio é composto por duas partes principais:
- **Backend:** Uma API RESTful desenvolvida em Node.js com Express, utilizando MongoDB como banco de dados. Responsável pela lógica de negócio, persistência de dados e autenticação de usuários.
- **Frontend:** Uma aplicação web desenvolvida com React e Vite, que consome a API do backend para fornecer uma interface de usuário intuitiva para o gerenciamento de pedidos.

## 2. Tecnologias Utilizadas

### Backend
- **Linguagem:** JavaScript (Node.js)
- **Framework:** Express.js
- **Banco de Dados:** MongoDB (com Mongoose para modelagem de dados)
- **Autenticação:** JSON Web Tokens (JWT)
- **Outras Bibliotecas:** bcryptjs (para hash de senhas), dotenv (para variáveis de ambiente), multer (para upload de arquivos), jsonwebtoken.

### Frontend
- **Framework:** React.js
- **Build Tool:** Vite
- **Gerenciamento de Pacotes:** npm
- **Linguagem:** JavaScript

## 3. Estrutura do Projeto

O projeto está organizado em duas pastas principais no diretório `03_Codigo_Fonte/`:
- `backend/`: Contém todo o código da API.
- `frontend/`: Contém todo o código da aplicação web.

Para detalhes sobre a estrutura interna de cada parte, consulte `01_Estrutura_Codigo/explicacoes_textuais_sobre_modulos_pacotes_camadas.txt` e `01_Estrutura_Codigo/diagrama_arquitetura.png`.

## 4. Como Rodar o Projeto Localmente

Para configurar e rodar o projeto em seu ambiente local, siga os passos abaixo:

### Pré-requisitos
- Node.js (versão 14 ou superior) e npm instalados.
- MongoDB instalado e rodando (ou acesso a uma instância de MongoDB Atlas).
- Git (opcional, para clonar o repositório).

### Passos de Instalação e Execução

1.  **Clone o Repositório (se aplicável):**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd menuzio # Ou o nome da sua pasta raiz
    ```
2.  **Configurar o Backend:**
    * Navegue até a pasta `backend`:
        ```bash
        cd backend
        ```
    * Instale as dependências:
        ```bash
        npm install
        ```
    * Crie um arquivo `.env` na raiz da pasta `backend` e configure as variáveis de ambiente necessárias. Consulte `variaveis_ambiente_exemplo.env.example` para os nomes das variáveis.
    * Inicie o servidor backend:
        ```bash
        node server.js
        ```
        O servidor estará rodando em `http://localhost:3000`.

3.  **Configurar o Frontend:**
    * **Abra um NOVO terminal** (mantenha o terminal do backend rodando).
    * Navegue até a pasta `frontend`:
        ```bash
        cd ../frontend
        ```
    * Instale as dependências:
        ```bash
        npm install
        ```
    * Inicie o servidor de desenvolvimento do frontend:
        ```bash
        npm run dev
        ```
        O frontend estará acessível em `http://localhost:5173`.

## 5. Uso do Sistema

* Acesse o frontend em seu navegador (geralmente `http://localhost:5173`).
* Você pode se registrar como um novo usuário ou usar as credenciais de teste que foram criadas no Postman (`teste2@example.com`, `senha123`).
* Explore as funcionalidades de gerenciamento de pedidos (listar, gerar, atualizar status).

Para uma explicação detalhada das funcionalidades e seus endpoints correspondentes, consulte `04_Demonstracao_Funcional/Funcionalidades.md`.

## 6. Documentação da API

A documentação da API do backend pode ser gerada usando JSDoc.
Para gerar a documentação:
* Navegue até a pasta `backend`.
* Execute `npm run docs-backend`.
* A documentação HTML será gerada na pasta `docs_jsdoc/` (o nome pode variar conforme a configuração).

Para visualizar a documentação gerada, abra `docs_jsdoc/index.html` em seu navegador.

## 7. Informações Adicionais

* **Banco de Dados:** O sistema utiliza MongoDB. Um script `schema_menuzio.sql` foi incluído para demonstração de um possível esquema de banco de dados relacional, embora o backend atual utilize MongoDB.
* **Políticas de Execução (Windows PowerShell):** Se encontrar o erro "Execution of scripts is disabled" ao executar `npm run dev` ou `npm install`, execute `Set-ExecutionPolicy RemoteSigned` como Administrador no PowerShell.
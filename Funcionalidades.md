# Funcionalidades Chave e Endpoints Correspondentes

Este documento descreve as principais funcionalidades do sistema Menuzio, detalhando os endpoints da API do Backend que são invocados para cada operação.

---

## 1. Autenticação de Usuário (Login)

**Descrição:** Permite que usuários cadastrados acessem o sistema, obtendo um token de autenticação JWT necessário para acessar rotas protegidas.

**Endpoint do Backend Invocado:**
* **Método:** `POST`
* **URL:** `http://localhost:3000/auth/login`

**Detalhes da Requisição:**
* **Corpo (Body) da Requisição (JSON):**
    ```json
    {
        "email": "email_do_usuario@example.com",
        "password": "senha_do_usuario"
    }
    ```
* **Headers:** `Content-Type: application/json`

**Resposta Esperada (Sucesso - Status 200 OK):**
* Um objeto JSON contendo o token JWT e dados básicos do usuário.
    ```json
    {
        "token": "eyJhbGciOiJIUzI1Ni...",
        "name": "Nome do Usuário",
        "foto": null
    }
    ```
**Comportamento no Frontend:** Após um login bem-sucedido, o frontend armazena o token e redireciona o usuário para a interface de gerenciamento de pedidos.

---

## 2. Listagem de Pedidos

**Descrição:** Exibe uma lista abrangente de todos os pedidos associados ao usuário autenticado.

**Endpoint do Backend Invocado:**
* **Método:** `GET`
* **URL:** `http://localhost:3000/pedidos`

**Detalhes da Requisição:**
* **Headers:**
    * `Authorization: Bearer <token_jwt_aqui>`

**Resposta Esperada (Sucesso - Status 200 OK):**
* Um array JSON contendo os detalhes completos de cada pedido.
    ```json
    [
        {
            "_id": "665b33dc6cdfab5b3ba0ac87",
            "id": "665b33dc6cdfab5b3ba0ac87",
            "title": "Pedido #7625",
            "mesa": "Mesa 04",
            "itens": [
                { "nome": "Caipirinha", "quantidade": 1 }
            ],
            "valor_total": 15,
            "status": "aberto",
            "createdAt": "2024-06-01T10:00:00.000Z",
            "updatedAt": "2024-06-01T10:00:00.000Z",
            "__v": 0
        }
        // ... outros pedidos
    ]
    ```
**Comportamento no Frontend:** Os dados dos pedidos são dinamicamente carregados e apresentados na interface do usuário.

---

## 3. Geração de Pedidos Aleatórios

**Descrição:** Funcionalidade de conveniência que permite criar rapidamente múltiplos pedidos com dados predefinidos para fins de teste ou demonstração.

**Endpoint do Backend Invocado:**
* **Método:** `POST`
* **URL:** `http://localhost:3000/pedidos/aleatorios`

**Detalhes da Requisição:**
* **Query Parameters (Opcional):**
    * `qtd`: Especifica a quantidade de pedidos a serem gerados (ex: `?qtd=5`). Se não for fornecido, um único pedido é gerado por padrão.
* **Headers:**
    * `Authorization: Bearer <token_jwt_aqui>`

**Resposta Esperada (Sucesso - Status 201 Created):**
* Um objeto JSON confirmando a criação e listando os pedidos gerados.
    ```json
    {
        "message": "5 pedidos criados com sucesso.",
        "pedidos": [
            // ... array de objetos de pedidos criados
        ]
    }
    ```
**Comportamento no Frontend:** Após a geração, a lista de pedidos é automaticamente atualizada para incluir os novos itens.

---

## 4. Atualização do Status de um Pedido

**Descrição:** Permite alterar o estado atual de um pedido, refletindo seu progresso no fluxo de serviço (e.g., de "aberto" para "pagamento").

**Endpoint do Backend Invocado:**
* **Método:** `PUT`
* **URL:** `http://localhost:3000/pedidos/:id/status` (onde `:id` deve ser substituído pelo ID único do pedido)

**Detalhes da Requisição:**
* **Corpo (Body) da Requisição (JSON):**
    ```json
    {
        "status": "pagamento"
    }
    ```
    * **Valores Válidos para `status`:** "aberto", "pagamento", "fechado".
* **Headers:**
    * `Content-Type: application/json`
    * `Authorization: Bearer <token_jwt_aqui>`

**Resposta Esperada (Sucesso - Status 200 OK):**
* Um objeto JSON confirmando a atualização e retornando os dados do pedido com o status modificado.
    ```json
    {
        "message": "Status atualizado com sucesso",
        "pedido": {
            // ... detalhes do pedido com o novo status
            "status": "pagamento"
        }
    }
    ```
**Comportamento no Frontend:** O status do pedido é visualmente atualizado na interface, proporcionando feedback instantâneo ao usuário.

---

## 5. Exclusão de Pedido

**Descrição:** Permite remover permanentemente um pedido específico do sistema.

**Endpoint do Backend Invocado:**
* **Método:** `DELETE`
* **URL:** `http://localhost:3000/pedidos/:id` (onde `:id` deve ser substituído pelo ID único do pedido)

**Detalhes da Requisição:**
* **Headers:**
    * `Authorization: Bearer <token_jwt_aqui>`

**Resposta Esperada (Sucesso - Status 200 OK):**
* Um objeto JSON confirmando a exclusão.
    ```json
    {
        "message": "Pedido excluído com sucesso"
    }
    ```
**Comportamento no Frontend:** O pedido é removido da lista exibida, e uma mensagem de confirmação pode ser mostrada ao usuário.
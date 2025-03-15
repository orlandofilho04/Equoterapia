# 🚀 Java API - Equoterapia

## 📂 Estrutura do Projeto
- **Diretório de trabalho:** `/Equoterapia`
- **Banco de dados:** MySQL (Docker container)
- **Aplicação:** API Java

## 🛠️ Pré-requisitos
Antes de iniciar, certifique-se de ter os seguintes itens instalados:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Maven](https://maven.apache.org/)
- [Java JDK 17+](https://adoptium.net/)

## 📌 Passo a Passo para Execução

### 1️⃣ Iniciar o Banco de Dados (MySQL)
Antes de iniciar a API, é necessário que o banco de dados esteja em execução. Para isso, utilize o comando:

```sh
docker-compose up -d db
```
> 🔹 Este comando inicializa **apenas o banco de dados** em modo **detached** (segundo plano).

### 2️⃣ Compilar a API Java
Agora, precisamos compilar a aplicação e gerar o arquivo `.jar` para o container:

```sh
mvn clean package
```
> 🔹 Esse comando gera a pasta `target/` contendo o arquivo `Equoterapia-0.0.1-SNAPSHOT.jar`.

### 3️⃣ Criar e Rodar o Container da API
Com o banco de dados já em execução e o `.jar` gerado, podemos subir o container da API junto com o banco de dados:

```sh
docker-compose up -d
```
> 🔹 Isso iniciará os containers da API e do banco de dados no Docker.

### 4️⃣ Verificar os Containers em Execução
Para garantir que os containers estão rodando corretamente, utilize:

```sh
docker ps
```
Ou verifique visualmente no **Docker Desktop**.

### 5️⃣ Testar a API
Com a API rodando, você pode testar as rotas disponíveis acessando a **documentação Swagger**:

📌 [Swagger UI - Documentação da API](http://localhost:8080/swagger-ui/)

> ⚠️ **Nota:** O corpo das requisições exibidas na documentação **não** são os utilizados para testes. Certifique-se de validar os formatos corretos antes de realizar chamadas reais à API.

### 6️⃣ Testar a API
Link para workspace no postman para teste das rotas:

📌 [Postman - Testes da API](https://www.postman.com/spaceflight-geologist-17996715/workspace/equoterapia-workspace/collection/37274122-0a958160-024f-45a3-b9fa-e8a5074f3fca?action=share&creator=37274122)

## ⏹️ Parando os Containers
Para parar os containers sem removê-los:
```sh
docker-compose stop
```
Para remover os containers completamente:
```sh
docker-compose down
```